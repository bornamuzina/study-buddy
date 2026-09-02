<script setup>
import Icon from './Icon.vue'

defineProps({
  name: { type: String, required: true },
  title: String,
  size: { type: String, default: 'h-4 w-4' },
  variant: { type: String, default: 'primary' },
  bare: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const variants = {
  primary: 'hover:text-sb-indigo',
  danger: 'hover:text-red-600',
}
</script>

<template>
  <button
    class="cursor-pointer text-slate-400 transition disabled:cursor-default disabled:opacity-30"
    :class="[variants[variant], !bare && 'rounded-lg p-2']"
    :title="title"
    :disabled="disabled"
  >
    <Icon :name="name" :size="size" />
  </button>
</template>
