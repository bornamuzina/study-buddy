<script setup>
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

defineProps({ title: String })

const open = defineModel({ type: Boolean })

defineEmits(['posalji'])
</script>

<template>
  <BaseModal v-model="open" :title="title">
    <form class="space-y-4" @submit.prevent="$emit('posalji')">
      <slot />

      <div class="flex justify-end gap-3 pt-2">
        <BaseButton type="button" variant="secondary" @click="open = false">Odustani</BaseButton>
        <BaseButton>Spremi</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
