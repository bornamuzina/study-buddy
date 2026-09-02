<script setup>
import BaseButton from './ui/BaseButton.vue'
import Icon from './ui/Icon.vue'

defineProps({ promijenjeno: Boolean, spremljeno: Boolean })

defineEmits(['spremi', 'odbaci'])
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="translate-y-4 opacity-0"
    leave-active-class="transition duration-200"
    leave-to-class="translate-y-4 opacity-0"
  >
    <div
      v-if="promijenjeno"
      key="promjene"
      class="rounded-card fixed inset-x-4 bottom-4 z-40 flex flex-wrap items-center justify-between gap-3 bg-white p-4 shadow-xl sm:inset-x-auto sm:right-8 sm:bottom-8 sm:gap-5 sm:pl-6"
    >
      <p class="text-sm font-semibold text-slate-700">Imate nespremljene promjene</p>
      <div class="flex items-center gap-2">
        <BaseButton variant="ghost" @click="$emit('odbaci')">Odbaci</BaseButton>
        <BaseButton @click="$emit('spremi')">Spremi promjene</BaseButton>
      </div>
    </div>
    <p
      v-else-if="spremljeno"
      key="spremljeno"
      class="rounded-card fixed right-4 bottom-4 z-40 flex items-center gap-2 bg-white px-6 py-4 text-sm font-semibold text-sb-teal shadow-xl sm:right-8 sm:bottom-8"
    >
      <Icon name="kvacica" size="h-4 w-4" />
      Spremljeno
    </p>
  </Transition>
</template>
