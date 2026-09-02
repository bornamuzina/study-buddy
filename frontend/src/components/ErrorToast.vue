<script setup>
import Icon from './ui/Icon.vue'
import { useGreske } from '../composables/greske'

const { poruka, ocisti } = useGreske()
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="translate-y-4 opacity-0"
    leave-active-class="transition duration-200"
    leave-to-class="translate-y-4 opacity-0"
  >
    <div
      v-if="poruka"
      role="alert"
      class="rounded-card fixed inset-x-4 bottom-4 z-60 flex items-center gap-3 bg-red-50 px-5 py-4 shadow-xl sm:inset-x-auto sm:right-8 sm:bottom-8 sm:max-w-sm"
    >
      <Icon name="zabrana" size="h-5 w-5 shrink-0 text-red-600" />
      <p class="flex-1 text-sm font-semibold text-red-700">{{ poruka }}</p>
      <button
        class="shrink-0 cursor-pointer rounded-lg p-1 text-red-600 transition hover:bg-red-100"
        title="Zatvori"
        @click="ocisti"
      >
        <Icon name="plus" size="h-4 w-4 rotate-45" />
      </button>
    </div>
  </Transition>
</template>
