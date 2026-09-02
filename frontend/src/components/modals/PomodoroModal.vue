<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import BaseButton from '../ui/BaseButton.vue'
import { usePomodoroStore } from '../../stores/pomodoro'
import { useSubjectsStore } from '../../stores/subjects'

const open = defineModel({ type: Boolean })

const pomodoro = usePomodoroStore()
const predmetiStore = useSubjectsStore()

const odabrani = ref(null)

const opcije = computed(() =>
  predmetiStore.predmeti.map((predmet) => ({ value: predmet.predmetId, label: predmet.naziv })),
)

watch(open, (vrijednost) => {
  if (vrijednost) odabrani.value = pomodoro.predmetId ?? opcije.value[0]?.value ?? null
})

function pokreni() {
  if (!odabrani.value) return
  pomodoro.postaviPredmet(odabrani.value)
  pomodoro.pokreni()
  open.value = false
}
</script>

<template>
  <BaseModal v-model="open" title="Pokreni Pomodoro">
    <template v-if="opcije.length">
      <p class="mb-4 text-sm text-slate-500">
        Odaberite predmet za koji se bilježi vrijeme ove sesije.
      </p>
      <BaseSelect v-model="odabrani" :options="opcije" class="w-full" />
      <div class="flex justify-end gap-3 pt-6">
        <BaseButton variant="secondary" @click="open = false">Odustani</BaseButton>
        <BaseButton @click="pokreni">Pokreni</BaseButton>
      </div>
    </template>

    <template v-else>
      <p class="text-sm text-slate-500">
        Nemate nijedan predmet, a sesija se bilježi uz predmet. Dodajte prvi predmet pa se vratite.
      </p>
      <div class="flex justify-end gap-3 pt-6">
        <BaseButton variant="secondary" @click="open = false">Odustani</BaseButton>
        <BaseButton to="/predmeti" @click="open = false">Dodaj predmet</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
