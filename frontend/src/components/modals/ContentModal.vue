<script setup>
import FormModal from '../ui/FormModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import BaseTextarea from '../ui/BaseTextarea.vue'
import BaseToggle from '../ui/BaseToggle.vue'
import { useModalForm } from '../../composables/modalForm'

const props = defineProps({ stavka: Object })

const open = defineModel({ type: Boolean })
const emit = defineEmits(['spremi'])

const tipOpcije = ['Obavijest', 'Savjet', 'Događanje', 'Ažuriranje'].map((tip) => ({
  value: tip,
  label: tip,
}))

const prazna = { tip: 'Obavijest', naslov: '', sadrzaj: '', poveznica: '', vidljiv: true }

const { obrazac, posalji } = useModalForm(open, prazna, {
  stavka: () => props.stavka,
  spremi: (podaci) => emit('spremi', podaci),
})
</script>

<template>
  <FormModal v-model="open" :title="stavka ? 'Uredi objavu' : 'Nova objava'" @posalji="posalji">
    <BaseSelect v-model="obrazac.tip" :options="tipOpcije" label="Tip" class="w-full" />
    <BaseInput v-model="obrazac.naslov" label="Naslov" />
    <BaseTextarea v-model="obrazac.sadrzaj" label="Sadržaj" :rows="6" />
    <BaseInput v-model="obrazac.poveznica" label="Poveznica (neobavezno)" placeholder="https://" />

    <div class="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3">
      <span class="text-sm text-slate-600">Vidljivo korisnicima</span>
      <BaseToggle v-model="obrazac.vidljiv" />
    </div>
  </FormModal>
</template>
