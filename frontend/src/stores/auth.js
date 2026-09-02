import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  linkWithCredential,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase'
import { useGreske } from '../composables/greske'
import { lokalnaTema } from '../utils/theme'
import { greska } from '../utils/errors'
import { isoDatum } from '../utils/format'

export const POMODORO_ZADANO = { minutaRada: 25, minutaPauze: 5, automatskiNastavak: true }

export const PREDLOZAK = {
  aktivan: true,
  uloga: 'student',
  googleId: '',
  profilnaSlika: '',
  sveuciliste: '',
  godina: 1,
  dnevniCiljSati: 6,
  preferencije: { jezik: 'hr', tema: 'svijetla' },
  obavijesti: { podsjetnici: true, pauze: true, ciljevi: false },
  vidjeneObavijesti: [],
  pomodoro: { ...POMODORO_ZADANO },
}

const imeIzEmaila = (email) =>
  email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((rijec) => rijec[0].toUpperCase() + rijec.slice(1))
    .join(' ')

const googleId = (racun) =>
  racun.providerData.find((davatelj) => davatelj.providerId === 'google.com')?.uid ?? ''

export const useAuthStore = defineStore('auth', () => {
  const { prikazi } = useGreske()
  const korisnik = ref(null)
  const davatelji = ref([])
  let razrijesi
  const inicijalizacija = new Promise((resolve) => (razrijesi = resolve))

  const prijavljen = computed(() => korisnik.value !== null)
  const imaLozinku = computed(() => davatelji.value.includes('password'))
  const jeAdmin = computed(() => korisnik.value?.uloga === 'admin')
  const inicijali = computed(() =>
    korisnik.value
      ? korisnik.value.ime
          .split(' ')
          .map((rijec) => rijec[0])
          .join('')
      : '',
  )

  const zapis = (korisnikId) => doc(db, 'korisnici', korisnikId)

  function noviProfil(racun) {
    return {
      ...PREDLOZAK,
      email: racun.email,
      ime: racun.displayName || imeIzEmaila(racun.email),
      googleId: googleId(racun),
      profilnaSlika: racun.photoURL || '',
      preferencije: {
        ...PREDLOZAK.preferencije,
        tema: lokalnaTema() ?? PREDLOZAK.preferencije.tema,
      },
      datumRegistracije: isoDatum(),
      zadnjaPrijava: new Date().toISOString(),
    }
  }

  function zapamtiDavatelje(racun) {
    davatelji.value = racun ? racun.providerData.map((davatelj) => davatelj.providerId) : []
  }

  async function ucitaj(racun) {
    const dokument = zapis(racun.uid)
    let snimka = await getDoc(dokument)
    if (!snimka.exists()) {
      await setDoc(dokument, noviProfil(racun))
      snimka = await getDoc(dokument)
    }
    korisnik.value = { korisnikId: racun.uid, ...snimka.data() }
    zapamtiDavatelje(racun)
    if (!korisnik.value.aktivan) {
      await odjava()
      throw greska('auth/user-disabled')
    }
    const promjene = { zadnjaPrijava: new Date().toISOString() }
    const google = googleId(racun)
    if (google && korisnik.value.googleId !== google) promjene.googleId = google
    if (korisnik.value.email !== racun.email) promjene.email = racun.email
    await azuriraj(promjene)
  }

  async function prijava(email, lozinka) {
    const { user } = await signInWithEmailAndPassword(auth, email, lozinka)
    await ucitaj(user)
  }

  async function registracija(email, lozinka) {
    const { user } = await createUserWithEmailAndPassword(auth, email, lozinka)
    await ucitaj(user)
  }

  async function prijavaGoogle() {
    const { user } = await signInWithPopup(auth, googleProvider)
    await ucitaj(user)
  }

  async function odjava() {
    korisnik.value = null
    zapamtiDavatelje(null)
    await signOut(auth)
  }

  const vjerodajnica = (lozinka) => EmailAuthProvider.credential(auth.currentUser.email, lozinka)

  async function postaviLozinku(lozinka) {
    await linkWithCredential(auth.currentUser, vjerodajnica(lozinka))
    zapamtiDavatelje(auth.currentUser)
  }

  async function promijeniLozinku(trenutna, nova) {
    await reauthenticateWithCredential(auth.currentUser, vjerodajnica(trenutna))
    await updatePassword(auth.currentUser, nova)
  }

  async function azuriraj(promjene) {
    const prethodni = korisnik.value
    korisnik.value = { ...prethodni, ...promjene }
    try {
      await updateDoc(zapis(prethodni.korisnikId), promjene)
    } catch (iznimka) {
      korisnik.value = prethodni
      throw iznimka
    }
  }

  async function deaktiviraj() {
    await azuriraj({ aktivan: false })
    await odjava()
  }

  onAuthStateChanged(auth, async (racun) => {
    if (racun && korisnik.value?.korisnikId !== racun.uid) {
      await ucitaj(racun).catch(prikazi)
    } else if (!racun) {
      korisnik.value = null
      zapamtiDavatelje(null)
    }
    razrijesi()
  })

  return {
    korisnik,
    inicijalizacija,
    prijavljen,
    imaLozinku,
    jeAdmin,
    inicijali,
    prijava,
    registracija,
    prijavaGoogle,
    odjava,
    postaviLozinku,
    promijeniLozinku,
    azuriraj,
    deaktiviraj,
  }
})
