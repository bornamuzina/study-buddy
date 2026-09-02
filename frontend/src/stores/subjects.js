import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref as mjestoDatoteke, uploadBytes } from 'firebase/storage'
import { db, spremiste } from '../firebase'
import { useCollection } from '../composables/collection'
import { useAuthStore } from './auth'
import { NAJVECI_PRILOG_KB, STATUSI } from '../data/constants'
import { greska } from '../utils/errors'
import { isoDatum } from '../utils/format'
import { uzlazno } from '../utils/sort'

function tipDatoteke(datoteka) {
  if (datoteka.type.startsWith('image/')) return 'slika'
  return datoteka.type === 'application/pdf' ? 'pdf' : 'dokument'
}

export const useSubjectsStore = defineStore('subjects', () => {
  const auth = useAuthStore()

  const zadaciPoPredmetu = ref({})
  const biljeskePoPredmetu = ref({})
  const priloziPoPredmetu = ref({})
  const slanjePriloga = ref(false)

  const PODZBIRKE = [
    { naziv: 'zadaci', kljuc: 'zadatakId', spremnik: zadaciPoPredmetu },
    { naziv: 'biljeske', kljuc: 'biljeskaId', spremnik: biljeskePoPredmetu },
    { naziv: 'prilozi', kljuc: 'prilogId', spremnik: priloziPoPredmetu },
  ]

  const zbirkaPredmeta = () => collection(db, 'korisnici', auth.korisnik.korisnikId, 'predmeti')
  const zapisPredmeta = (predmetId) => doc(zbirkaPredmeta(), predmetId)
  const podzbirka = (predmetId, naziv) => collection(zapisPredmeta(predmetId), naziv)

  const odjavePodzbirki = new Map()

  function pratiPodzbirke(predmetId) {
    const odjave = PODZBIRKE.map(({ naziv, kljuc, spremnik }) =>
      onSnapshot(podzbirka(predmetId, naziv), (snimka) => {
        spremnik.value = {
          ...spremnik.value,
          [predmetId]: snimka.docs.map((dokument) => ({
            [kljuc]: dokument.id,
            predmetId,
            ...dokument.data(),
          })),
        }
      }),
    )
    odjavePodzbirki.set(predmetId, odjave)
  }

  function prestaniPratiti(predmetId) {
    odjavePodzbirki.get(predmetId).forEach((odjava) => odjava())
    odjavePodzbirki.delete(predmetId)
    PODZBIRKE.forEach(({ spremnik }) => {
      const preostali = { ...spremnik.value }
      delete preostali[predmetId]
      spremnik.value = preostali
    })
  }

  function uskladiPodzbirke(idevi) {
    idevi.filter((predmetId) => !odjavePodzbirki.has(predmetId)).forEach(pratiPodzbirke)
    ;[...odjavePodzbirki.keys()]
      .filter((predmetId) => !idevi.includes(predmetId))
      .forEach(prestaniPratiti)
  }

  function ocistiPodzbirke() {
    odjavePodzbirki.forEach((odjave) => odjave.forEach((odjava) => odjava()))
    odjavePodzbirki.clear()
    PODZBIRKE.forEach(({ spremnik }) => (spremnik.value = {}))
  }

  const { stavke: predmeti, ucitavanje: ucitavanjePredmeta } = useCollection(
    () => auth.korisnik?.korisnikId,
    zbirkaPredmeta,
    'predmetId',
    {
      sortiraj: uzlazno('naziv'),
      nakon: (dohvaceni) => uskladiPodzbirke(dohvaceni.map((predmet) => predmet.predmetId)),
      priPrekidu: ocistiPodzbirke,
    },
  )

  const zadaci = computed(() => Object.values(zadaciPoPredmetu.value).flat())
  const biljeske = computed(() => Object.values(biljeskePoPredmetu.value).flat())
  const prilozi = computed(() => Object.values(priloziPoPredmetu.value).flat())

  const ucitavanje = computed(
    () =>
      ucitavanjePredmeta.value ||
      predmeti.value.some((predmet) =>
        PODZBIRKE.some(({ spremnik }) => !(predmet.predmetId in spremnik.value)),
      ),
  )

  const zadaciPredmeta = (predmetId) => zadaciPoPredmetu.value[predmetId] ?? []
  const biljeskePredmeta = (predmetId) => biljeskePoPredmetu.value[predmetId] ?? []
  const priloziPredmeta = (predmetId) => priloziPoPredmetu.value[predmetId] ?? []
  const predmetPoId = (predmetId) =>
    predmeti.value.find((predmet) => predmet.predmetId === predmetId)

  function stavkaPoId(naziv, id) {
    const { kljuc, spremnik } = PODZBIRKE.find((skup) => skup.naziv === naziv)
    return Object.values(spremnik.value)
      .flat()
      .find((stavka) => stavka[kljuc] === id)
  }

  function zapisStavke(naziv, id) {
    const stavka = stavkaPoId(naziv, id)
    return stavka ? doc(podzbirka(stavka.predmetId, naziv), id) : null
  }

  const urediStavku = (naziv) => (id, promjene) => {
    const zapis = zapisStavke(naziv, id)
    return zapis && updateDoc(zapis, promjene)
  }

  const obrisiStavku = (naziv) => (id) => {
    const zapis = zapisStavke(naziv, id)
    return zapis && deleteDoc(zapis)
  }

  const kategorijePredmeta = (predmetId) =>
    [...new Set(biljeskePredmeta(predmetId).map((biljeska) => biljeska.kategorija))]
      .filter(Boolean)
      .sort((prva, druga) => prva.localeCompare(druga))

  const naCekanju = (predmetId) =>
    zadaciPredmeta(predmetId).filter((zadatak) => zadatak.status !== STATUSI.ZAVRSENO).length

  function napredak(predmetId) {
    const svi = zadaciPredmeta(predmetId)
    if (!svi.length) return 0
    const zavrseni = svi.filter((zadatak) => zadatak.status === STATUSI.ZAVRSENO).length
    return Math.round((zavrseni / svi.length) * 100)
  }

  function dodajPredmet(predmet) {
    return addDoc(zbirkaPredmeta(), { ikona: 'knjiga', ...predmet })
  }

  function urediPredmet(predmetId, promjene) {
    return updateDoc(zapisPredmeta(predmetId), promjene)
  }

  async function obrisiPredmet(predmetId) {
    await Promise.all(priloziPredmeta(predmetId).map((prilog) => obrisiDatoteku(prilog.putanja)))
    await Promise.all(
      PODZBIRKE.flatMap(({ naziv, kljuc, spremnik }) =>
        (spremnik.value[predmetId] ?? []).map((stavka) =>
          deleteDoc(doc(podzbirka(predmetId, naziv), stavka[kljuc])),
        ),
      ),
    )
    await deleteDoc(zapisPredmeta(predmetId))
  }

  function dodajZadatak({ predmetId, ...zadatak }) {
    return addDoc(podzbirka(predmetId, 'zadaci'), {
      status: STATUSI.NA_CEKANJU,
      opis: '',
      ...zadatak,
    })
  }

  const urediZadatak = urediStavku('zadaci')
  const obrisiZadatak = obrisiStavku('zadaci')

  function prebaciStatus(zadatakId) {
    const zadatak = stavkaPoId('zadaci', zadatakId)
    if (!zadatak) return
    const status = zadatak.status === STATUSI.ZAVRSENO ? STATUSI.NA_CEKANJU : STATUSI.ZAVRSENO
    return urediZadatak(zadatakId, { status })
  }

  function dodajBiljesku({ predmetId, ...biljeska }) {
    return addDoc(podzbirka(predmetId, 'biljeske'), { datum: isoDatum(), ...biljeska })
  }

  const urediBiljesku = urediStavku('biljeske')
  const obrisiBiljesku = obrisiStavku('biljeske')

  const obrisiDatoteku = (putanja) =>
    putanja ? deleteObject(mjestoDatoteke(spremiste, putanja)) : Promise.resolve()

  async function dodajPrilog({ predmetId, datoteka }) {
    if (datoteka.size / 1024 > NAJVECI_PRILOG_KB) throw greska('app/prilog-prevelik')
    slanjePriloga.value = true
    try {
      const putanja = `korisnici/${auth.korisnik.korisnikId}/predmeti/${predmetId}/${Date.now()}-${datoteka.name}`
      const mjesto = mjestoDatoteke(spremiste, putanja)
      await uploadBytes(mjesto, datoteka, {
        contentDisposition: `attachment; filename="${datoteka.name}"`,
      })
      await addDoc(podzbirka(predmetId, 'prilozi'), {
        naziv: datoteka.name,
        tip: tipDatoteke(datoteka),
        velicinaKb: Math.round(datoteka.size / 1024),
        url: await getDownloadURL(mjesto),
        putanja,
        datum: isoDatum(),
      })
    } finally {
      slanjePriloga.value = false
    }
  }

  async function obrisiPrilog(prilogId) {
    const prilog = stavkaPoId('prilozi', prilogId)
    if (!prilog) return
    await obrisiDatoteku(prilog.putanja)
    await deleteDoc(doc(podzbirka(prilog.predmetId, 'prilozi'), prilogId))
  }

  return {
    predmeti,
    zadaci,
    ucitavanje,
    slanjePriloga,
    biljeske,
    prilozi,
    predmetPoId,
    zadaciPredmeta,
    biljeskePredmeta,
    kategorijePredmeta,
    priloziPredmeta,
    naCekanju,
    napredak,
    dodajPredmet,
    urediPredmet,
    obrisiPredmet,
    dodajZadatak,
    urediZadatak,
    obrisiZadatak,
    prebaciStatus,
    dodajBiljesku,
    urediBiljesku,
    obrisiBiljesku,
    dodajPrilog,
    obrisiPrilog,
  }
})
