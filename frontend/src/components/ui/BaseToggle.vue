<script setup>
const model = defineModel({ type: Boolean })
</script>

<template>
  <button
    type="button"
    class="h-7 w-12 cursor-pointer rounded-full p-1 transition"
    :class="model ? 'bg-sb-indigo' : 'bg-slate-300'"
    @click="model = !model"
  >
    <span
      class="block h-5 w-5 rounded-full bg-white transition"
      :class="model && 'translate-x-5'"
    />
  </button>
</template>
