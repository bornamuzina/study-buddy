<script setup>
defineProps({ tekst: { type: String, default: 'Učitavanje' } })
</script>

<template>
  <div class="flex items-center justify-center gap-3 py-10 text-sm text-slate-500">
    <span
      class="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sb-indigo"
    ></span>
    {{ tekst }}
  </div>
</template>
