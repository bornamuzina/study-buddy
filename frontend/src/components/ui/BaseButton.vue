<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  block: { type: Boolean, default: false },
  to: { type: String, default: '' },
})

const variants = {
  primary: 'bg-sb-indigo text-sb-light hover:bg-sb-hover',
  secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-red-600 text-sb-light hover:bg-red-700',
}
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'button'"
    :to="to || undefined"
    class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-center text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
    :class="[variants[variant], block && 'w-full']"
  >
    <slot />
  </component>
</template>
