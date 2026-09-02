<script setup>
defineProps({
  title: String,
})

const open = defineModel({ type: Boolean })
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
    @click.self="open = false"
  >
    <div
      class="rounded-card max-h-full w-full max-w-lg overflow-y-auto bg-white p-5 shadow-xl sm:p-6"
    >
      <h2 class="mb-5 text-xl font-bold text-sb-blue">{{ title }}</h2>
      <slot />
    </div>
  </div>
</template>
