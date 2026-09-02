<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  size: { type: Number, default: 140 },
  stroke: { type: Number, default: 12 },
  color: { type: String, default: '#0f766e' },
})

const radius = computed(() => (props.size - props.stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value * (1 - Math.min(props.value, 100) / 100))
</script>

<template>
  <div class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg class="-rotate-90" :width="size" :height="size">
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-width="stroke"
        class="stroke-slate-200"
        fill="none"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-width="stroke"
        :stroke="color"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        stroke-linecap="round"
        fill="none"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <slot />
    </div>
  </div>
</template>
