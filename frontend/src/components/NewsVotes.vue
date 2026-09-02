<script setup>
import { computed } from 'vue'
import Icon from './ui/Icon.vue'
import { useGreske } from '../composables/greske'
import { useNewsStore } from '../stores/news'

const props = defineProps({ objava: { type: Object, required: true } })

const novosti = useNewsStore()
const { pokusaj } = useGreske()

const glasaj = (vrijednost) => pokusaj(() => novosti.glasaj(props.objava.sadrzajId, vrijednost))

const moj = computed(() => novosti.mojGlas(props.objava))
const rezultat = computed(() => novosti.rezultat(props.objava))

const bojaRezultata = computed(() => {
  if (rezultat.value > 0) return 'text-sb-teal'
  return rezultat.value < 0 ? 'text-red-600' : 'text-slate-500'
})
</script>

<template>
  <div class="flex w-12 shrink-0 flex-col items-center">
    <button
      class="cursor-pointer rounded-lg p-1 transition"
      :class="moj === 1 ? 'text-sb-teal' : 'text-slate-400 hover:text-sb-teal'"
      :title="moj === 1 ? 'Ukloni glas' : 'Glas za'"
      @click="glasaj(1)"
    >
      <Icon name="lijevo" size="h-5 w-5 rotate-90" />
    </button>
    <span class="text-sm font-bold tabular-nums" :class="bojaRezultata">{{ rezultat }}</span>
    <button
      class="cursor-pointer rounded-lg p-1 transition"
      :class="moj === -1 ? 'text-red-600' : 'text-slate-400 hover:text-red-600'"
      :title="moj === -1 ? 'Ukloni glas' : 'Glas protiv'"
      @click="glasaj(-1)"
    >
      <Icon name="desno" size="h-5 w-5 rotate-90" />
    </button>
  </div>
</template>
