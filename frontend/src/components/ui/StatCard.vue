<script setup>
import BaseCard from './BaseCard.vue'

defineProps({
  label: { type: String, required: true },
  value: [String, Number],
  hint: String,
})
</script>

<template>
  <BaseCard>
    <p class="text-sm text-slate-500">{{ label }}</p>
    <p v-if="value" class="mt-2 text-4xl font-bold text-sb-indigo">{{ value }}</p>
    <slot />
    <p v-if="hint" class="mt-2 text-sm text-sb-teal">{{ hint }}</p>
  </BaseCard>
</template>
