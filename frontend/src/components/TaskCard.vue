<script setup>
import BaseBadge from './ui/BaseBadge.vue'
import Icon from './ui/Icon.vue'
import { prioritetBoja, prioritetNaziv, relativniRok, danaDo } from '../utils/format'

defineProps({ zadatak: { type: Object, required: true }, predmet: Object })
</script>

<template>
  <div class="rounded-card bg-white p-5 shadow-sm">
    <div class="mb-3 flex items-start justify-between">
      <BaseBadge :color="prioritetBoja[zadatak.prioritet]">{{
        prioritetNaziv[zadatak.prioritet]
      }}</BaseBadge>
      <Icon name="vise" size="h-5 w-5 text-slate-400" />
    </div>

    <p class="font-semibold text-slate-900">{{ zadatak.naslov }}</p>
    <p class="mt-1 text-xs text-slate-500">
      {{ predmet?.naziv }}<span v-if="zadatak.opis"> • {{ zadatak.opis }}</span>
    </p>

    <p
      class="mt-4 flex items-center gap-1.5 text-xs"
      :class="danaDo(zadatak.rokIzvrsenja) <= 1 ? 'font-semibold text-red-600' : 'text-slate-500'"
    >
      <Icon name="kalendar" size="h-4 w-4" />
      {{ relativniRok(zadatak.rokIzvrsenja) }}
    </p>
  </div>
</template>
