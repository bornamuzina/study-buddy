<script setup>
import Icon from './Icon.vue'

defineProps({
  title: { type: String, required: true },
  icon: String,
  tag: { type: String, default: 'h3' },
  size: { type: String, default: 'text-xl' },
})
</script>

<template>
  <div class="rounded-card bg-slate-100 p-4 sm:p-6">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <component :is="tag" class="flex items-center gap-2 font-bold text-slate-900" :class="size">
        <Icon v-if="icon" :name="icon" />
        {{ title }}
      </component>
      <div v-if="$slots.akcije" class="flex flex-wrap items-center gap-3">
        <slot name="akcije" />
      </div>
    </div>

    <slot />
  </div>
</template>
