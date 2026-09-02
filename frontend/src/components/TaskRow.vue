<script setup>
import Icon from './ui/Icon.vue'
import IconButton from './ui/IconButton.vue'
import BaseBadge from './ui/BaseBadge.vue'
import { STATUSI } from '../data/constants'
import { prioritetBoja, prioritetNaziv, relativniRok, statusNaziv } from '../utils/format'

defineProps({ zadatak: { type: Object, required: true } })

defineEmits(['prebaci', 'uredi', 'obrisi'])
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
    <button
      class="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition"
      :class="
        zadatak.status === STATUSI.ZAVRSENO
          ? 'border-sb-indigo bg-sb-indigo text-sb-light'
          : 'border-slate-300'
      "
      :title="zadatak.status === STATUSI.ZAVRSENO ? 'Vrati na čekanje' : 'Označi kao završeno'"
      @click="$emit('prebaci')"
    >
      <Icon v-if="zadatak.status === STATUSI.ZAVRSENO" name="kvacica" size="h-3.5 w-3.5" />
    </button>

    <div class="min-w-0 flex-1 basis-40">
      <p
        class="text-sm font-semibold wrap-break-word"
        :class="
          zadatak.status === STATUSI.ZAVRSENO ? 'text-slate-400 line-through' : 'text-slate-800'
        "
      >
        {{ zadatak.naslov }}
      </p>
      <p class="mt-1 flex items-center gap-2 text-xs text-slate-500">
        {{ relativniRok(zadatak.rokIzvrsenja) }} •
        {{ statusNaziv[zadatak.status] }}
      </p>
    </div>

    <div class="ml-auto flex shrink-0 items-center gap-3">
      <BaseBadge :color="prioritetBoja[zadatak.prioritet]">{{
        prioritetNaziv[zadatak.prioritet]
      }}</BaseBadge>

      <IconButton bare name="olovka" size="h-5 w-5" title="Uredi zadatak" @click="$emit('uredi')" />
      <IconButton
        bare
        name="kanta"
        size="h-5 w-5"
        variant="danger"
        title="Obriši zadatak"
        @click="$emit('obrisi')"
      />
    </div>
  </div>
</template>
