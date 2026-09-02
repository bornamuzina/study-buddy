<script setup>
import { computed } from 'vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseBadge from '../components/ui/BaseBadge.vue'
import Icon from '../components/ui/Icon.vue'
import IconTile from '../components/ui/IconTile.vue'
import ProgressBar from '../components/ui/ProgressBar.vue'
import TimerCard from '../components/TimerCard.vue'
import DonutChart from '../components/charts/DonutChart.vue'
import { useNewsStore } from '../stores/news'
import { STATUSI } from '../data/constants'
import { predmeti, zadaci } from '../data/showcase'
import { bojaPredmeta, prioritetBoja, prioritetNaziv, relativniRok } from '../utils/format'

const novosti = useNewsStore()

const MINUTA_IZLOGA = [320, 240, 180]

const prikazaniPredmeti = predmeti.slice(0, 3)
const prikazaniZadaci = zadaci.slice(0, 2)

const napredak = (predmetId) => {
  const svi = zadaci.filter((zadatak) => zadatak.predmetId === predmetId)
  const zavrseni = svi.filter((zadatak) => zadatak.status === STATUSI.ZAVRSENO).length
  return svi.length ? Math.round((zavrseni / svi.length) * 100) : 0
}

const ukupnoMinuta = MINUTA_IZLOGA.reduce((zbroj, minuta) => zbroj + minuta, 0)

const raspodjela = prikazaniPredmeti.map((predmet, indeks) => ({
  ...predmet,
  minuta: MINUTA_IZLOGA[indeks],
  postotak: Math.round((MINUTA_IZLOGA[indeks] / ukupnoMinuta) * 100),
}))

const istaknuto = computed(() => novosti.vidljive.slice(0, 3))
</script>

<template>
  <section class="bg-sb-surface px-4 py-14 sm:px-6 sm:py-20 lg:px-12 lg:py-24">
    <div class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
      <div>
        <h1 class="text-4xl leading-tight font-bold text-slate-900 sm:text-5xl lg:text-6xl">
          Više fokusa,<br />bolje ocjene.
        </h1>
        <p class="mt-6 text-lg text-slate-500">
          Kolegiji, zadaci i bilješke na jednom mjestu, uz timer koji vas drži u fokusu.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <BaseButton to="/registracija">Započnite besplatno</BaseButton>
          <BaseButton to="/prijava" variant="secondary">Prijava</BaseButton>
        </div>
      </div>

      <Icon name="naslovnica_latice" size="mx-auto aspect-square w-full max-w-md text-slate-900" />
    </div>
  </section>

  <section class="bg-slate-100 px-4 py-14 sm:px-6 sm:py-20 lg:px-12">
    <div class="mx-auto max-w-7xl">
      <h2 class="text-3xl font-bold text-sb-indigo sm:text-4xl">Vladajte svojim vremenom</h2>
      <p class="mt-2 text-slate-500">Alati skrojeni za svakodnevnicu studenta.</p>

      <div class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <IconTile
            name="mapa"
            size="h-12 w-12"
            icon-size="h-6 w-6"
            class="mb-5 bg-teal-100 text-teal-600"
          />
          <h3 class="text-2xl font-bold text-slate-900">Organizirani kolegiji</h3>
          <p class="mt-2 mb-6 text-slate-500">
            Svaki kolegij dobiva svoj prostor. Materijali, zadaci i bilješke stoje uz predmet kojem
            pripadaju, a ne u istoj hrpi.
          </p>

          <div class="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
            <div
              v-for="predmet in prikazaniPredmeti"
              :key="predmet.predmetId"
              class="rounded-lg bg-white p-3 shadow-sm"
            >
              <span
                class="mb-2 flex h-7 w-7 items-center justify-center rounded-lg"
                :class="[bojaPredmeta(predmet.boja).pozadina, bojaPredmeta(predmet.boja).tekst]"
              >
                <Icon :name="predmet.ikona" size="h-4 w-4" />
              </span>
              <p class="text-xs font-semibold text-slate-800">
                {{ predmet.naziv }}
              </p>
              <p class="mb-2 text-[10px] text-slate-400 italic">
                {{ predmet.opis }}
              </p>
              <ProgressBar
                :value="napredak(predmet.predmetId)"
                :color="bojaPredmeta(predmet.boja).traka"
              />
            </div>
          </div>
        </div>

        <div
          class="grid grid-cols-1 items-center gap-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-2"
        >
          <div>
            <IconTile
              name="sat"
              size="h-12 w-12"
              icon-size="h-6 w-6"
              class="mb-5 bg-indigo-100 text-sb-indigo"
            />
            <h3 class="text-2xl font-bold text-slate-900">Pomodoro timer</h3>
            <p class="mt-2 text-slate-500">
              Dokazana metoda: 25 minuta rada, pa kratka pauza. I tako ukrug.
            </p>
          </div>
          <TimerCard />
        </div>

        <div
          class="grid grid-cols-1 items-center gap-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-2"
        >
          <div>
            <IconTile
              name="graf"
              size="h-12 w-12"
              icon-size="h-6 w-6"
              class="mb-5 bg-amber-100 text-amber-600"
            />
            <h3 class="text-2xl font-bold text-slate-900">Vizualna statistika</h3>
            <p class="mt-2 text-slate-500">
              Grafovi pokazuju koliko ste vremena uložili u koji kolegij i kako napredujete kroz
              semestar.
            </p>
          </div>

          <div class="rounded-xl bg-slate-50 p-4">
            <p class="mb-2 text-xs font-semibold text-slate-600">Raspodjela predmeta</p>
            <div class="relative h-32">
              <DonutChart
                :labels="raspodjela.map((predmet) => predmet.naziv)"
                :values="raspodjela.map((predmet) => predmet.minuta)"
                :colors="raspodjela.map((predmet) => bojaPredmeta(predmet.boja).hex)"
              />
            </div>
            <div class="mt-3 space-y-1">
              <div
                v-for="stavka in raspodjela"
                :key="stavka.predmetId"
                class="flex items-center gap-2 text-[10px]"
              >
                <span class="h-2 w-2 rounded-full" :class="bojaPredmeta(stavka.boja).traka" />
                <span class="flex-1 text-slate-500">{{ stavka.naziv }}</span>
                <span class="font-semibold text-slate-700">{{ stavka.postotak }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <IconTile
            name="kvacica"
            size="h-12 w-12"
            icon-size="h-6 w-6"
            class="mb-5 bg-teal-100 text-teal-600"
          />
          <h3 class="text-2xl font-bold text-slate-900">Zadaci pod kontrolom</h3>
          <p class="mt-2 mb-6 text-slate-500">
            Popis poredajte po roku ili po prioritetu, ovisno o tome što vam je tog dana važnije.
          </p>

          <div class="rounded-xl bg-slate-50 p-4">
            <p class="mb-3 text-xs font-semibold text-slate-600">Aktivni zadaci</p>
            <div
              v-for="zadatak in prikazaniZadaci"
              :key="zadatak.zadatakId"
              class="mb-2 rounded-lg bg-white p-3 shadow-sm"
            >
              <p class="text-xs font-semibold text-slate-800">
                {{ zadatak.naslov }}
              </p>
              <div class="mt-1.5 flex items-center gap-2">
                <BaseBadge :color="prioritetBoja[zadatak.prioritet]">
                  {{ prioritetNaziv[zadatak.prioritet] }}
                </BaseBadge>
                <span class="text-[10px] text-slate-400">{{
                  relativniRok(zadatak.rokIzvrsenja)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="istaknuto.length" class="mt-16">
        <h2 class="text-2xl font-bold text-sb-indigo">Novosti iz zajednice</h2>
        <p class="mt-2 text-slate-500">Prijavite se da biste čitali objave i glasali o njima.</p>
        <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <RouterLink
            v-for="stavka in istaknuto"
            :key="stavka.sadrzajId"
            :to="`/novosti/${stavka.sadrzajId}`"
            class="rounded-card block bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <BaseBadge color="indigo">{{ stavka.tip }}</BaseBadge>
            <p class="mt-3 font-semibold text-slate-900">{{ stavka.naslov }}</p>
            <p class="mt-1 line-clamp-2 text-sm text-slate-500">{{ stavka.sadrzaj }}</p>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
