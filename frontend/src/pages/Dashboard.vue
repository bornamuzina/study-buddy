<script setup>
import { computed, ref } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import IconTile from '../components/ui/IconTile.vue'
import RingProgress from '../components/ui/RingProgress.vue'
import SectionPanel from '../components/ui/SectionPanel.vue'
import TimerCard from '../components/TimerCard.vue'
import TaskCard from '../components/TaskCard.vue'
import Loader from '../components/ui/Loader.vue'
import { useAuthStore } from '../stores/auth'
import { useSubjectsStore } from '../stores/subjects'
import { useStatisticsStore } from '../stores/statistics'
import { usePomodoroStore } from '../stores/pomodoro'
import { STATUSI } from '../data/constants'
import { bojaPredmeta, danaDo, decimalni, prijeVremena, sBrojem, satiIMinute } from '../utils/format'
import { silazno } from '../utils/sort'

const auth = useAuthStore()
const predmetiStore = useSubjectsStore()
const statistika = useStatisticsStore()
const pomodoro = usePomodoroStore()

const SORTIRANJA = [
  { kljuc: 'datum', naziv: 'Po datumu' },
  { kljuc: 'prioritet', naziv: 'Prioritet' },
]

const sortiranje = ref('datum')

const pozdrav = computed(() => {
  const sat = new Date().getHours()
  if (sat < 12) return 'Dobro jutro'
  if (sat < 18) return 'Dobar dan'
  return 'Dobra večer'
})

const ime = computed(() => auth.korisnik.ime.split(' ')[0])

const ciljMinuta = computed(() => auth.korisnik.dnevniCiljSati * 60)
const postotakCilja = computed(() => Math.round((statistika.danasMinuta / ciljMinuta.value) * 100))
const porukaCilja = computed(() => {
  if (postotakCilja.value >= 100) return 'Cilj ispunjen!'
  if (postotakCilja.value >= 60) return 'Skoro pa gotovo!'
  return 'Tek ste počeli.'
})

const bojaPredmetaPoId = (predmetId) => predmetiStore.predmetPoId(predmetId)?.boja ?? 'indigo'
const nazivPredmeta = (predmetId) => predmetiStore.predmetPoId(predmetId)?.naziv ?? 'Predmet'

const nedavno = computed(() =>
  [
    ...pomodoro.sesije.map((sesija) => ({
      id: `sesija-${sesija.sesijaId}`,
      ikona: 'sat',
      boja: bojaPredmetaPoId(sesija.predmetId),
      naslov: nazivPredmeta(sesija.predmetId),
      opis: `Sesija fokusa, ${satiIMinute(sesija.trajanje)}`,
      vrijeme: sesija.zavrsetak,
    })),
    ...predmetiStore.biljeske.map((biljeska) => ({
      id: `biljeska-${biljeska.biljeskaId}`,
      ikona: 'dokument',
      boja: bojaPredmetaPoId(biljeska.predmetId),
      naslov: biljeska.naslov,
      opis: `Bilješka uz predmet ${nazivPredmeta(biljeska.predmetId)}`,
      vrijeme: biljeska.datum,
    })),
    ...predmetiStore.prilozi.map((prilog) => ({
      id: `prilog-${prilog.prilogId}`,
      ikona: 'mapa',
      boja: bojaPredmetaPoId(prilog.predmetId),
      naslov: prilog.naziv,
      opis: `Prilog uz predmet ${nazivPredmeta(prilog.predmetId)}`,
      vrijeme: prilog.datum,
    })),
  ]
    .sort(silazno('vrijeme'))
    .slice(0, 4),
)

const tezinaPrioriteta = { VISOK: 0, SREDNJI: 1, NIZAK: 2 }

const nadolazeci = computed(() => {
  const otvoreni = predmetiStore.zadaci.filter((zadatak) => zadatak.status !== STATUSI.ZAVRSENO)
  const poredani = [...otvoreni].sort((prvi, drugi) =>
    sortiranje.value === 'datum'
      ? danaDo(prvi.rokIzvrsenja) - danaDo(drugi.rokIzvrsenja)
      : tezinaPrioriteta[prvi.prioritet] - tezinaPrioriteta[drugi.prioritet],
  )
  return poredani.slice(0, 3)
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-slate-900 sm:text-4xl">{{ pozdrav }}, {{ ime }}!</h1>
    <p class="mt-2 text-slate-500">Spremni za deep work sesiju?</p>

    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <TimerCard />

      <BaseCard>
        <p class="text-lg font-semibold text-slate-800">Današnji cilj</p>
        <div class="mt-4 flex flex-col items-center">
          <RingProgress :value="postotakCilja">
            <span class="text-3xl font-bold text-slate-900">{{ postotakCilja }}%</span>
          </RingProgress>
          <p class="mt-4 text-sm text-slate-500">
            {{ decimalni(statistika.danasMinuta / 60, 1) }} /
            {{ sBrojem(auth.korisnik.dnevniCiljSati, 'sat', 'sata', 'sati') }} odrađeno
          </p>
          <p class="mt-1 text-sm font-semibold text-sb-teal">
            {{ porukaCilja }}
          </p>
        </div>
      </BaseCard>

      <BaseCard>
        <p class="mb-4 text-lg font-semibold text-slate-800">Nedavna aktivnost</p>

        <p v-if="!nedavno.length" class="text-sm text-slate-500">
          Još nema zabilježene aktivnosti. Pokrenite sesiju ili dodajte bilješku.
        </p>

        <div v-else class="space-y-4">
          <div v-for="stavka in nedavno" :key="stavka.id" class="flex gap-3">
            <IconTile
              :name="stavka.ikona"
              :class="[bojaPredmeta(stavka.boja).pozadina, bojaPredmeta(stavka.boja).tekst]"
            />
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-slate-800">
                {{ stavka.naslov }}
              </p>
              <p class="text-xs text-slate-500">
                {{ stavka.opis }} • {{ prijeVremena(stavka.vrijeme) }}
              </p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <SectionPanel title="Nadolazeći zadaci" tag="h2" size="text-2xl" class="mt-6">
      <template #akcije>
        <button
          v-for="opcija in SORTIRANJA"
          :key="opcija.kljuc"
          class="cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition"
          :class="
            sortiranje === opcija.kljuc ? 'bg-sb-indigo text-sb-light' : 'bg-white text-slate-600'
          "
          @click="sortiranje = opcija.kljuc"
        >
          {{ opcija.naziv }}
        </button>
      </template>

      <Loader v-if="predmetiStore.ucitavanje" tekst="Učitavanje zadataka" />
      <div
        v-else-if="nadolazeci.length"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <TaskCard
          v-for="zadatak in nadolazeci"
          :key="zadatak.zadatakId"
          :zadatak="zadatak"
          :predmet="predmetiStore.predmetPoId(zadatak.predmetId)"
        />
      </div>
      <p v-else class="text-sm text-slate-500">Nema otvorenih zadataka. Odlično!</p>
    </SectionPanel>
  </div>
</template>
