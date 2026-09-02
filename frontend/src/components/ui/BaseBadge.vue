<script setup>
defineProps({
  color: { type: String, default: 'slate' },
})

const colors = {
  slate: 'bg-slate-100 text-slate-600',
  indigo: 'bg-indigo-100 text-sb-blue',
  red: 'bg-red-100 text-red-600',
  teal: 'bg-teal-100 text-teal-700',
  amber: 'bg-amber-100 text-amber-700',
  green: 'bg-emerald-100 text-emerald-700',
}
</script>

<template>
  <span
    class="rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase"
    :class="colors[color]"
  >
    <slot />
  </span>
</template>
