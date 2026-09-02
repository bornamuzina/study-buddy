<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: String, default: 'h-5 w-5' },
})

const datoteke = import.meta.glob('../../assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const ikone = Object.fromEntries(
  Object.entries(datoteke).map(([putanja, sadrzaj]) => [
    putanja.split('/').pop().replace('.svg', ''),
    sadrzaj
      .replace(/(stroke|fill)="(?!none)[^"]*"/g, '$1="currentColor"')
      .replace(/\s(width|height)="[^"]*"/g, ' $1="100%"'),
  ]),
)
</script>

<template>
  <span class="inline-flex shrink-0" :class="size" aria-hidden="true" v-html="ikone[name]" />
</template>
