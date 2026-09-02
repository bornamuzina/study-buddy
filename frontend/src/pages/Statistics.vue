<script setup>
import { computed, ref } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseSelect from '../components/ui/BaseSelect.vue'
import StatCard from '../components/ui/StatCard.vue'
import ProgressBar from '../components/ui/ProgressBar.vue'
import Icon from '../components/ui/Icon.vue'
import PageHeading from '../components/ui/PageHeading.vue'
import Loader from '../components/ui/Loader.vue'
import BarChart from '../components/charts/BarChart.vue'
import LineChart from '../components/charts/LineChart.vue'
import DonutChart from '../components/charts/DonutChart.vue'
import { useStatisticsStore } from '../stores/statistics'
import { useSubjectsStore } from '../stores/subjects'
import { usePomodoroStore } from '../stores/pomodoro'
import { bojaPredmeta, decimalni, sBrojem, satiIMinute } from '../utils/format'

const statistika = useStatisticsStore()
const predmetiStore = useSubjectsStore()
const pomodoro = usePomodoroStore()

const ucitavanje = computed(() => predmetiStore.ucitavanje || pomodoro.ucitavanje)

const odabraniPredmet = ref('svi')
const razdoblje = ref(4)

const predmetOpcije = computed(() => [
  { value: 'svi', label: 'Svi predmeti' },
  ...predmetiStore.predmeti.map((predmet) => ({ value: predmet.predmetId, label: predmet.naziv })),
])

const razdobljeOpcije = [
  { value: 4, label: 'Zadnja 4 tjedna' },
  { value: 8, label: 'Zadnjih 8 tjedana' },
]

const poDanima = computed(() => statistika.poDanuTjedna(odabraniPredmet.value))
const poTjednima = computed(() => statistika.poTjednu(razdoblje.value, odabraniPredmet.value))
const raspodjela = computed(() => statistika.poPredmetu)
const postotakZadataka = computed(() =>
  statistika.ukupnoZadataka
    ? Math.round((statistika.dovrseniZadaci / statistika.ukupnoZadataka) * 100)
    : 0,
)

const daniUFlowu = computed(
  () => statistika.poDanuTjedna().filter((dan) => dan.minuta > 0).length,
)
</script>

<template>
  <div>
    <PageHeading
      title="Statistika učenja"
      subtitle="Pregled vremena provedenog u učenju po danima, tjednima i predmetima."
    />

    <Loader v-if="ucitavanje" tekst="Učitavanje statistike" />
    <template v-else>
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <StatCard
          label="Ukupno vrijeme učenja"
          :value="sBrojem(statistika.ukupnoSati, 'sat', 'sata', 'sati')"
        >
          <p
            v-if="statistika.promjenaTjedna"
            class="mt-2 flex items-center gap-1.5 text-sm"
            :class="statistika.promjenaTjedna > 0 ? 'text-sb-teal' : 'text-red-600'"
          >
            <Icon name="munja" size="h-4 w-4" />
            {{ statistika.promjenaTjedna > 0 ? '+' : '' }}{{ statistika.promjenaTjedna }}% u odnosu
            na prošli tjedan
          </p>
        </StatCard>

        <StatCard label="Najviše učen predmet">
          <p class="mt-2 text-3xl font-bold text-sb-teal">
            {{ statistika.najuceniPredmet?.naziv ?? '-' }}
          </p>
          <p
            v-if="statistika.najuceniPredmet"
            class="mt-2 flex items-center gap-1.5 text-sm text-slate-500"
          >
            <Icon name="sat" size="h-4 w-4" />
            ukupno {{ satiIMinute(statistika.najuceniPredmet.minuta) }}
          </p>
        </StatCard>

        <StatCard label="Dovršeni zadaci">
          <p class="mt-2 text-4xl font-bold text-slate-900">
            {{ statistika.dovrseniZadaci }}
            <span class="text-2xl text-slate-400">/ {{ statistika.ukupnoZadataka }}</span>
          </p>
          <div class="mt-4">
            <ProgressBar :value="postotakZadataka" color="bg-sb-teal" />
          </div>
        </StatCard>
      </div>

      <BaseCard class="mt-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <p class="flex items-center gap-2 font-semibold text-slate-700">
            <Icon name="filter" />
            Prilagodi prikaz
          </p>
          <div class="flex flex-wrap gap-3">
            <BaseSelect v-model="odabraniPredmet" :options="predmetOpcije" />
            <BaseSelect v-model="razdoblje" :options="razdobljeOpcije" />
          </div>
        </div>
      </BaseCard>

      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <BaseCard class="lg:col-span-2">
          <p class="mb-4 text-xl font-bold text-sb-indigo">Sati po danima</p>
          <div class="h-64">
            <BarChart
              :labels="poDanima.map((stavka) => stavka.dan)"
              :values="poDanima.map((stavka) => stavka.sati)"
            />
          </div>
        </BaseCard>

        <BaseCard>
          <p class="mb-4 text-xl font-bold text-slate-900">Raspodjela po predmetima</p>
          <div class="relative h-48">
            <DonutChart
              :labels="raspodjela.map((predmet) => predmet.naziv)"
              :values="raspodjela.map((predmet) => predmet.minuta)"
              :colors="raspodjela.map((predmet) => bojaPredmeta(predmet.boja).hex)"
            />
            <div
              class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
            >
              <span class="text-3xl font-bold text-slate-900">
                {{ decimalni(statistika.ukupnoSati) }}
              </span>
              <span class="text-[10px] tracking-widest text-slate-400 uppercase">sati</span>
            </div>
          </div>

          <div class="mt-5 space-y-2">
            <div
              v-for="stavka in raspodjela"
              :key="stavka.predmetId"
              class="flex items-center gap-2 text-sm"
            >
              <span class="h-2.5 w-2.5 rounded-full" :class="bojaPredmeta(stavka.boja).traka" />
              <span class="flex-1 text-slate-600">{{ stavka.naziv }}</span>
              <span class="font-semibold text-slate-800">{{ stavka.postotak }}%</span>
            </div>
          </div>
        </BaseCard>
      </div>

      <BaseCard class="mt-6">
        <p class="mb-4 text-xl font-bold text-slate-900">Sati po tjednima</p>
        <div class="h-64">
          <LineChart
            :labels="poTjednima.map((tjedan) => tjedan.oznaka)"
            :values="poTjednima.map((tjedan) => tjedan.sati)"
          />
        </div>
      </BaseCard>

      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="rounded-card bg-sb-indigo p-6 text-sb-light sm:p-8">
          <p class="text-2xl font-bold">Najbolji dan</p>
          <p class="mt-3 text-sb-light/80">
            Najproduktivniji dan ovog tjedna je
            <span class="font-semibold text-sb-light">{{
              statistika.najproduktivnijiDan.dan
            }}</span>
            s {{ satiIMinute(statistika.najproduktivnijiDan.minuta) }} fokusiranog rada.
          </p>
          <p class="mt-6 flex items-center gap-2 font-semibold">
            <Icon name="munja" />
            {{ sBrojem(daniUFlowu, 'dan', 'dana', 'dana') }} u flowu ovaj tjedan
          </p>
        </div>

        <BaseCard>
          <p class="text-xl font-bold text-slate-900">Riješeni zadaci</p>
          <p class="mt-3 text-slate-500">
            Riješili ste {{ statistika.dovrseniZadaci }} od
            {{ sBrojem(statistika.ukupnoZadataka, 'zadatka', 'zadatka', 'zadataka') }} ({{
              postotakZadataka
            }}%). Nastavite ovim tempom.
          </p>
          <RouterLink
            to="/predmeti"
            class="mt-6 flex items-center gap-2 font-semibold text-sb-indigo"
          >
            Otvorite predmete
            <Icon name="desno" size="h-4 w-4" />
          </RouterLink>
        </BaseCard>
      </div>
    </template>
  </div>
</template>
