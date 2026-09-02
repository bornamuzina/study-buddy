<script setup>
import BaseBadge from '../components/ui/BaseBadge.vue'
import Icon from '../components/ui/Icon.vue'
import Loader from '../components/ui/Loader.vue'
import PageHeading from '../components/ui/PageHeading.vue'
import NewsVotes from '../components/NewsVotes.vue'
import { useNewsStore } from '../stores/news'
import { formatDatum } from '../utils/format'

const novosti = useNewsStore()
</script>

<template>
  <div>
    <PageHeading
      title="Novosti"
      subtitle="Objave administratora, poredane po glasovima korisnika."
    />

    <Loader v-if="novosti.ucitavanje" />

    <p
      v-else-if="!novosti.vidljive.length"
      class="rounded-card bg-white p-6 text-sm text-slate-500 sm:p-8"
    >
      Trenutno nema objava.
    </p>

    <div v-else class="space-y-3">
      <article
        v-for="objava in novosti.vidljive"
        :key="objava.sadrzajId"
        class="rounded-card flex gap-4 bg-white p-4 sm:gap-5 sm:p-5"
      >
        <NewsVotes :objava="objava" />

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-3">
            <BaseBadge color="indigo">{{ objava.tip }}</BaseBadge>
            <span class="text-xs text-slate-400">{{ formatDatum(objava.datum) }}</span>
          </div>
          <RouterLink
            :to="`/novosti/${objava.sadrzajId}`"
            class="mt-2 block text-lg font-bold text-slate-900 transition hover:text-sb-indigo"
          >
            {{ objava.naslov }}
          </RouterLink>
          <p class="mt-1 line-clamp-2 text-sm text-slate-500">{{ objava.sadrzaj }}</p>
          <a
            v-if="objava.poveznica"
            :href="objava.poveznica"
            target="_blank"
            rel="noreferrer"
            class="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-sb-indigo"
          >
            <Icon name="iskra" size="h-3.5 w-3.5" />
            Vanjska poveznica
          </a>
        </div>
      </article>
    </div>
  </div>
</template>
