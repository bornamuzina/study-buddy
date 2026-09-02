<script setup>
import BaseModal from '../ui/BaseModal.vue'
import BaseButton from '../ui/BaseButton.vue'

defineProps({ upit: Object })

const emit = defineEmits(['odgovor'])
</script>

<template>
  <BaseModal
    :model-value="Boolean(upit)"
    :title="upit?.naslov"
    @update:model-value="emit('odgovor', false)"
  >
    <p class="text-sm text-slate-600">{{ upit?.tekst }}</p>

    <div class="flex justify-end gap-3 pt-6">
      <BaseButton variant="secondary" @click="emit('odgovor', false)">Odustani</BaseButton>
      <BaseButton :variant="upit?.opasno ? 'danger' : 'primary'" @click="emit('odgovor', true)">
        {{ upit?.gumb }}
      </BaseButton>
    </div>
  </BaseModal>
</template>
