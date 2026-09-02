<script setup>
import Icon from './ui/Icon.vue'
import IconButton from './ui/IconButton.vue'
import { formatDatum, formatVelicina } from '../utils/format'

defineProps({ prilog: { type: Object, required: true } })

defineEmits(['obrisi'])

const ikone = { pdf: 'dokument', slika: 'mapa', dokument: 'dokument' }
const boje = {
  pdf: 'bg-red-100 text-red-600',
  slika: 'bg-teal-100 text-teal-600',
  dokument: 'bg-indigo-100 text-sb-indigo',
}
</script>

<template>
  <div class="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
    <span
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
      :class="boje[prilog.tip]"
    >
      <Icon :name="ikone[prilog.tip]" size="h-5 w-5" />
    </span>

    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold text-slate-800" :title="prilog.naziv">
        {{ prilog.naziv }}
      </p>
      <p class="text-xs text-slate-400">
        {{ formatVelicina(prilog.velicinaKb) }} •
        {{ formatDatum(prilog.datum) }}
      </p>
    </div>

    <a
      :href="prilog.url"
      download
      class="text-slate-400 transition hover:text-sb-indigo"
      title="Preuzmi"
    >
      <Icon name="preuzimanje" size="h-4 w-4" />
    </a>

    <IconButton bare name="kanta" variant="danger" title="Obriši prilog" @click="$emit('obrisi')" />
  </div>
</template>
