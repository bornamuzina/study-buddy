<script setup>
import FormModal from '../ui/FormModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import { useModalForm } from '../../composables/modalForm'
import { PRIORITETI, STATUSI } from '../../data/constants'
import { isoDatum, prioritetNaziv, statusNaziv } from '../../utils/format'

const props = defineProps({ zadatak: Object })

const open = defineModel({ type: Boolean })
const emit = defineEmits(['spremi'])

const prazan = {
  naslov: '',
  opis: '',
  rokIzvrsenja: isoDatum(),
  prioritet: PRIORITETI.SREDNJI,
  status: STATUSI.NA_CEKANJU,
}

const { obrazac, posalji } = useModalForm(open, prazan, {
  stavka: () => props.zadatak,
  spremi: (podaci) => emit('spremi', podaci),
})

const prioritetOpcije = Object.values(PRIORITETI).map((prioritet) => ({
  value: prioritet,
  label: prioritetNaziv[prioritet],
}))
const statusOpcije = Object.values(STATUSI).map((status) => ({
  value: status,
  label: statusNaziv[status],
}))
</script>

<template>
  <FormModal v-model="open" :title="zadatak ? 'Uredi zadatak' : 'Novi zadatak'" @posalji="posalji">
    <BaseInput v-model="obrazac.naslov" label="Naslov" placeholder="npr. Riješi zadaću 3" />
    <BaseInput v-model="obrazac.opis" label="Opis" placeholder="Neobavezno" />
    <BaseInput v-model="obrazac.rokIzvrsenja" label="Rok izvršenja" type="date" />

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <BaseSelect
        v-model="obrazac.prioritet"
        :options="prioritetOpcije"
        label="Prioritet"
        class="w-full"
      />
      <BaseSelect v-model="obrazac.status" :options="statusOpcije" label="Status" class="w-full" />
    </div>
  </FormModal>
</template>
