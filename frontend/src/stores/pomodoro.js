import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { useCollection } from '../composables/collection'
import { useGreske } from '../composables/greske'
import { POMODORO_ZADANO, useAuthStore } from './auth'
import { pripremiZvuk, zvukKraja } from '../utils/sound'

const SESIJA_U_CIKLUSU = 4

let interval = null

export const usePomodoroStore = defineStore('pomodoro', () => {
  const auth = useAuthStore()
  const { pokusaj } = useGreske()

  const faza = ref('rad')
  const sekunde = ref(POMODORO_ZADANO.minutaRada * 60)
  const radi = ref(false)
  const sesija = ref(1)
  const predmetId = ref(null)

  const postavke = computed(() => ({ ...POMODORO_ZADANO, ...auth.korisnik?.pomodoro }))

  const minute = computed(() => String(Math.floor(sekunde.value / 60)).padStart(2, '0'))
  const preostaleSekunde = computed(() => String(sekunde.value % 60).padStart(2, '0'))
  const prikaz = computed(() => `${minute.value}:${preostaleSekunde.value}`)
  const trajanjeFaze = computed(
    () => (faza.value === 'rad' ? postavke.value.minutaRada : postavke.value.minutaPauze) * 60,
  )
  const napredak = computed(() => ((trajanjeFaze.value - sekunde.value) / trajanjeFaze.value) * 100)
  const opisSesije = computed(() => `Sesija ${sesija.value} od ${SESIJA_U_CIKLUSU}`)

  const zbirkaSesija = () => collection(db, 'korisnici', auth.korisnik.korisnikId, 'pomodoroSesije')

  const { stavke: sesije, ucitavanje } = useCollection(
    () => auth.korisnik?.korisnikId,
    zbirkaSesija,
    'sesijaId',
  )

  function spremiSesiju() {
    const trajanje = postavke.value.minutaRada
    const zavrsetak = new Date()
    const pocetak = new Date(zavrsetak.getTime() - trajanje * 60000)
    return addDoc(zbirkaSesija(), {
      predmetId: predmetId.value,
      pocetak: pocetak.toISOString(),
      zavrsetak: zavrsetak.toISOString(),
      trajanje,
    })
  }

  function sljedecaFaza() {
    const zavrsenRad = faza.value === 'rad'
    if (zavrsenRad) {
      pokusaj(spremiSesiju)
      faza.value = 'pauza'
      sesija.value = (sesija.value % SESIJA_U_CIKLUSU) + 1
    } else {
      faza.value = 'rad'
    }
    sekunde.value = trajanjeFaze.value
    if (auth.korisnik?.obavijesti?.pauze) zvukKraja(zavrsenRad ? 880 : 660)
    if (postavke.value.automatskiNastavak) pokreni()
  }

  function zaustavi() {
    radi.value = false
    clearInterval(interval)
    interval = null
  }

  function pokreni() {
    if (radi.value) return
    pripremiZvuk()
    radi.value = true
    interval = setInterval(() => {
      if (sekunde.value > 0) sekunde.value--
      else {
        zaustavi()
        sljedecaFaza()
      }
    }, 1000)
  }

  function resetiraj() {
    zaustavi()
    faza.value = 'rad'
    sekunde.value = trajanjeFaze.value
  }

  function postaviPredmet(id) {
    predmetId.value = id
  }

  watch(
    trajanjeFaze,
    (trajanje) => {
      if (!radi.value) sekunde.value = trajanje
    },
    { immediate: true },
  )

  return {
    sesije,
    ucitavanje,
    postavke,
    faza,
    sekunde,
    radi,
    sesija,
    predmetId,
    prikaz,
    napredak,
    opisSesije,
    pokreni,
    zaustavi,
    resetiraj,
    postaviPredmet,
  }
})
