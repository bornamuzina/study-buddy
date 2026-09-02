<script setup>
import Icon from './Icon.vue'

defineProps({
  name: { type: String, required: true },
  size: { type: String, default: 'h-10 w-10' },
  iconSize: String,
})
</script>

<template>
  <span class="flex shrink-0 items-center justify-center rounded-xl" :class="size">
    <Icon :name="name" :size="iconSize" />
  </span>
</template>
