<script setup>
import FormModal from '../ui/FormModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import { useModalForm } from '../../composables/modalForm'
import { bojePredmeta } from '../../utils/format'

const props = defineProps({ predmet: Object })

const open = defineModel({ type: Boolean })
const emit = defineEmits(['spremi'])

const prazan = { naziv: '', opis: '', boja: 'indigo', ikona: 'knjiga' }

const { obrazac, posalji } = useModalForm(open, prazan, {
  stavka: () => props.predmet,
  spremi: (podaci) => emit('spremi', podaci),
  obavezno: 'naziv',
})

const bojeOpcije = Object.keys(bojePredmeta).map((boja) => ({ value: boja, label: boja }))
const ikoneOpcije = [
  { value: 'knjiga', label: 'Knjiga' },
  { value: 'ploca', label: 'Ploča' },
  { value: 'graf', label: 'Graf' },
  { value: 'iskra', label: 'Iskra' },
  { value: 'sat', label: 'Sat' },
]
</script>

<template>
  <FormModal v-model="open" :title="predmet ? 'Uredi predmet' : 'Novi predmet'" @posalji="posalji">
    <BaseInput v-model="obrazac.naziv" label="Naziv" placeholder="npr. Strukture podataka" />
    <BaseInput v-model="obrazac.opis" label="Opis" placeholder="npr. Računalne znanosti 202" />

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <BaseSelect v-model="obrazac.boja" :options="bojeOpcije" label="Boja" class="w-full" />
      <BaseSelect v-model="obrazac.ikona" :options="ikoneOpcije" label="Ikona" class="w-full" />
    </div>
  </FormModal>
</template>
