<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseBadge from '../components/ui/BaseBadge.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import Icon from '../components/ui/Icon.vue'
import Loader from '../components/ui/Loader.vue'
import NewsVotes from '../components/NewsVotes.vue'
import { useNewsStore } from '../stores/news'
import { formatDatum } from '../utils/format'

const route = useRoute()
const novosti = useNewsStore()

const objava = computed(() => novosti.objavaPoId(route.params.sadrzajId))
</script>

<template>
  <div>
    <RouterLink
      to="/novosti"
      class="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-sb-indigo"
    >
      <Icon name="lijevo" size="h-4 w-4" />
      Sve novosti
    </RouterLink>

    <Loader v-if="novosti.ucitavanje" />

    <div v-else-if="!objava || !objava.vidljiv" class="rounded-card bg-white p-6 sm:p-8">
      <p class="text-lg font-bold text-slate-900">Objava nije pronađena</p>
      <p class="mt-1 mb-5 text-sm text-slate-500">
        Objava je uklonjena ili je poveznica neispravna.
      </p>
      <BaseButton to="/novosti">Natrag na novosti</BaseButton>
    </div>

    <article v-else class="rounded-card flex gap-4 bg-white p-5 sm:gap-6 sm:p-8">
      <NewsVotes :objava="objava" />

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-3">
          <BaseBadge color="indigo">{{ objava.tip }}</BaseBadge>
          <span class="text-xs text-slate-400">{{ formatDatum(objava.datum) }}</span>
        </div>
        <h1 class="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{{ objava.naslov }}</h1>
        <p class="mt-4 leading-relaxed whitespace-pre-line text-slate-600">
          {{ objava.sadrzaj }}
        </p>
        <a
          v-if="objava.poveznica"
          :href="objava.poveznica"
          target="_blank"
          rel="noreferrer"
          class="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-sb-indigo transition hover:bg-indigo-100"
        >
          <Icon name="iskra" size="h-4 w-4" />
          {{ objava.poveznica }}
        </a>
      </div>
    </article>
  </div>
</template>
