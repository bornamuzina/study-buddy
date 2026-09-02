import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useSubjectsStore } from './subjects'
import { useStatisticsStore } from './statistics'
import { useNewsStore } from './news'
import { danaDo, sBrojem, satiIMinute } from '../utils/format'
import { silazno } from '../utils/sort'
import { STATUSI } from '../data/constants'

const DANA_NOVOSTI = 3

export const useNotificationsStore = defineStore('notifications', () => {
  const auth = useAuthStore()
  const predmetiStore = useSubjectsStore()
  const statistika = useStatisticsStore()
  const novosti = useNewsStore()

  const ukljuceno = (kljuc) => Boolean(auth.korisnik?.obavijesti?.[kljuc])

  const opisRoka = (dana) => {
    if (dana < 0) return `Rok je prošao prije ${sBrojem(Math.abs(dana), 'dan', 'dana', 'dana')}`
    return dana === 0 ? 'Rok istječe danas' : 'Rok je sutra'
  }

  const rokovi = computed(() => {
    if (!ukljuceno('podsjetnici')) return []
    return predmetiStore.zadaci
      .filter((zadatak) => zadatak.status !== STATUSI.ZAVRSENO && danaDo(zadatak.rokIzvrsenja) <= 1)
      .sort((prvi, drugi) => danaDo(prvi.rokIzvrsenja) - danaDo(drugi.rokIzvrsenja))
      .map((zadatak) => ({
        id: `rok-${zadatak.zadatakId}`,
        ikona: 'kalendar',
        hitno: danaDo(zadatak.rokIzvrsenja) < 0,
        naslov: zadatak.naslov,
        opis: opisRoka(danaDo(zadatak.rokIzvrsenja)),
        poveznica: '/predmeti',
      }))
  })

  const ciljevi = computed(() => {
    if (!ukljuceno('ciljevi') || !auth.korisnik || !statistika.danasMinuta) return []
    const cilj = auth.korisnik.dnevniCiljSati * 60
    const preostalo = cilj - statistika.danasMinuta
    return [
      {
        id: 'cilj-danas',
        ikona: 'pehar',
        hitno: false,
        naslov: preostalo <= 0 ? 'Dnevni cilj je ispunjen' : 'Dnevni cilj je nadohvat',
        opis:
          preostalo <= 0
            ? `Danas ste odradili ${satiIMinute(statistika.danasMinuta)}.`
            : `Još ${satiIMinute(preostalo)} do cilja od ${sBrojem(auth.korisnik.dnevniCiljSati, 'sat', 'sata', 'sati')}.`,
        poveznica: '/statistika',
      },
    ]
  })

  const objave = computed(() =>
    [...novosti.vidljive]
      .sort(silazno('datum'))
      .filter((objava) => danaDo(objava.datum) > -DANA_NOVOSTI)
      .slice(0, 3)
      .map((objava) => ({
        id: `objava-${objava.sadrzajId}`,
        ikona: 'iskra',
        hitno: false,
        naslov: objava.naslov,
        opis: `Nova objava u Novostima - ${objava.tip}`,
        poveznica: `/novosti/${objava.sadrzajId}`,
      })),
  )

  const stavke = computed(() => [...rokovi.value, ...ciljevi.value, ...objave.value])
  const vidjene = computed(() => auth.korisnik?.vidjeneObavijesti ?? [])
  const nove = computed(() => stavke.value.filter((stavka) => !vidjene.value.includes(stavka.id)))
  const broj = computed(() => nove.value.length)
  const sveIskljuceno = computed(() => !ukljuceno('podsjetnici') && !ukljuceno('ciljevi'))

  function oznaciVidjene() {
    if (!auth.korisnik || !nove.value.length) return
    return auth.azuriraj({ vidjeneObavijesti: stavke.value.map((stavka) => stavka.id) })
  }

  return { stavke, nove, broj, sveIskljuceno, oznaciVidjene }
})
