<script setup>
import znakSirovi from '../assets/header_icon.svg?raw'

defineProps({
  icon: { type: Boolean, default: true },
  size: { type: String, default: 'text-2xl' },
})

const znak = znakSirovi
  .replace(/fill="#312E81"/g, 'fill="currentColor"')
  .replace(/^<svg[^>]*>/, (oznaka) => oznaka.replace(/\s(width|height)="[^"]*"/g, ' $1="100%"'))
</script>

<template>
  <div class="flex items-center gap-2">
    <span
      v-if="icon"
      class="inline-flex h-8 w-8 shrink-0 text-sb-blue sm:h-9 sm:w-9"
      aria-hidden="true"
      v-html="znak"
    />
    <p class="font-bold text-sb-blue" :class="size">StudyBuddy</p>
  </div>
</template>
