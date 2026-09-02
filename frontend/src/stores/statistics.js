import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePomodoroStore } from './pomodoro'
import { useSubjectsStore } from './subjects'
import { STATUSI } from '../data/constants'

const DANI = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned']

function pocetakTjedna(datum) {
  const dan = new Date(datum)
  dan.setHours(0, 0, 0, 0)
  const pomak = (dan.getDay() + 6) % 7
  dan.setDate(dan.getDate() - pomak)
  return dan
}

function uSate(minuta) {
  return Math.round((minuta / 60) * 10) / 10
}

export const useStatisticsStore = defineStore('statistics', () => {
  const pomodoro = usePomodoroStore()
  const predmetiStore = useSubjectsStore()

  const filtrirane = (predmetId) =>
    predmetId && predmetId !== 'svi'
      ? pomodoro.sesije.filter((sesija) => sesija.predmetId === predmetId)
      : pomodoro.sesije

  const zbroj = (sesije) => sesije.reduce((ukupno, sesija) => ukupno + sesija.trajanje, 0)

  const ukupnoMinuta = computed(() => zbroj(pomodoro.sesije))
  const ukupnoSati = computed(() => uSate(ukupnoMinuta.value))

  const poPredmetu = computed(() =>
    predmetiStore.predmeti
      .map((predmet) => {
        const minuta = zbroj(filtrirane(predmet.predmetId))
        return {
          predmetId: predmet.predmetId,
          naziv: predmet.naziv,
          boja: predmet.boja,
          minuta,
          sati: uSate(minuta),
          postotak: ukupnoMinuta.value ? Math.round((minuta / ukupnoMinuta.value) * 100) : 0,
        }
      })
      .filter((stavka) => stavka.minuta > 0)
      .sort((prvi, drugi) => drugi.minuta - prvi.minuta),
  )

  const najuceniPredmet = computed(() => poPredmetu.value[0] ?? null)

  function minutaUTjednu(pomakTjedana, predmetId) {
    const pocetak = pocetakTjedna(new Date())
    pocetak.setDate(pocetak.getDate() - pomakTjedana * 7)
    const kraj = new Date(pocetak)
    kraj.setDate(kraj.getDate() + 7)
    return zbroj(
      filtrirane(predmetId).filter((sesija) => {
        const datum = new Date(sesija.pocetak)
        return datum >= pocetak && datum < kraj
      }),
    )
  }

  function poDanuTjedna(predmetId) {
    const pocetak = pocetakTjedna(new Date())
    return DANI.map((dan, indeks) => {
      const datum = new Date(pocetak)
      datum.setDate(datum.getDate() + indeks)
      const minuta = zbroj(
        filtrirane(predmetId).filter(
          (sesija) => new Date(sesija.pocetak).toDateString() === datum.toDateString(),
        ),
      )
      return { dan, minuta, sati: uSate(minuta) }
    })
  }

  function poTjednu(brojTjedana, predmetId) {
    return Array.from({ length: brojTjedana }, (_, indeks) => ({
      oznaka: `Tjedan ${String(indeks + 1).padStart(2, '0')}`,
      sati: uSate(minutaUTjednu(brojTjedana - 1 - indeks, predmetId)),
    }))
  }

  const promjenaTjedna = computed(() => {
    const prosli = minutaUTjednu(1)
    if (!prosli) return 0
    return Math.round(((minutaUTjednu(0) - prosli) / prosli) * 100)
  })

  const danasMinuta = computed(() =>
    zbroj(
      pomodoro.sesije.filter(
        (sesija) => new Date(sesija.pocetak).toDateString() === new Date().toDateString(),
      ),
    ),
  )

  const najproduktivnijiDan = computed(() => {
    const dani = poDanuTjedna()
    return dani.reduce((najbolji, dan) => (dan.minuta > najbolji.minuta ? dan : najbolji), dani[0])
  })

  const dovrseniZadaci = computed(
    () => predmetiStore.zadaci.filter((zadatak) => zadatak.status === STATUSI.ZAVRSENO).length,
  )
  const ukupnoZadataka = computed(() => predmetiStore.zadaci.length)

  return {
    ukupnoMinuta,
    ukupnoSati,
    poPredmetu,
    najuceniPredmet,
    poDanuTjedna,
    poTjednu,
    promjenaTjedna,
    danasMinuta,
    najproduktivnijiDan,
    dovrseniZadaci,
    ukupnoZadataka,
  }
})
