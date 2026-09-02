<script setup>
defineProps({
  ime: { type: String, default: '' },
  size: { type: String, default: 'h-10 w-10 text-sm' },
})

const inicijali = (ime) =>
  ime
    .split(' ')
    .map((rijec) => rijec[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
</script>

<template>
  <span
    class="flex shrink-0 items-center justify-center rounded-full bg-sb-indigo font-semibold text-sb-light"
    :class="size"
  >
    {{ inicijali(ime) }}
  </span>
</template>
