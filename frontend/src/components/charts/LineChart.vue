<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { BOJA, osi, osnovne } from './options'

const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
})

const data = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      borderColor: BOJA,
      backgroundColor: 'rgba(63, 69, 181, 0.12)',
      pointBackgroundColor: BOJA,
      pointRadius: 4,
      tension: 0.35,
      fill: true,
    },
  ],
}))

const options = { ...osnovne, scales: osi }
</script>

<template>
  <Line :data="data" :options="options" />
</template>
