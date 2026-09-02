<script setup>
defineProps({
  value: { type: Number, required: true },
  color: { type: String, default: 'bg-sb-indigo' },
})
</script>

<template>
  <div class="h-1.5 w-full rounded-full bg-slate-200">
    <div
      class="h-full rounded-full transition-all"
      :class="color"
      :style="{ width: `${Math.min(value, 100)}%` }"
    />
  </div>
</template>
