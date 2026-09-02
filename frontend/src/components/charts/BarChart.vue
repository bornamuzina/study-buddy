<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { BOJA, osi, osnovne } from './options'

const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  label: { type: String, default: '' },
  color: { type: String, default: BOJA },
})

const data = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.label,
      data: props.values,
      backgroundColor: props.color,
      borderRadius: 8,
      maxBarThickness: 44,
    },
  ],
}))

const options = { ...osnovne, scales: osi }
</script>

<template>
  <Bar :data="data" :options="options" />
</template>
