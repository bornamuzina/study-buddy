<script setup>
import { computed, watch } from 'vue'
import { usePomodoroStore } from '../stores/pomodoro'
import { useSubjectsStore } from '../stores/subjects'
import { useAuthStore } from '../stores/auth'
import BaseCard from './ui/BaseCard.vue'
import BaseSelect from './ui/BaseSelect.vue'
import BaseButton from './ui/BaseButton.vue'
import Icon from './ui/Icon.vue'

const props = defineProps({ predmetId: { type: String, default: null } })

const pomodoro = usePomodoroStore()
const predmetiStore = useSubjectsStore()
const auth = useAuthStore()

const prikaziIzbor = computed(() => auth.prijavljen && !props.predmetId)

const opcije = computed(() => [
  { value: null, label: 'Odaberite predmet' },
  ...predmetiStore.predmeti.map((predmet) => ({ value: predmet.predmetId, label: predmet.naziv })),
])

const odabrani = computed({
  get: () => pomodoro.predmetId,
  set: (predmetId) => pomodoro.postaviPredmet(predmetId),
})

const spreman = computed(() => !auth.prijavljen || Boolean(pomodoro.predmetId))

const drugiPredmet = computed(
  () => props.predmetId && pomodoro.predmetId && pomodoro.predmetId !== props.predmetId,
)

watch(
  () => props.predmetId,
  (predmetId) => {
    if (predmetId && !pomodoro.radi) pomodoro.postaviPredmet(predmetId)
  },
  { immediate: true },
)
</script>

<template>
  <BaseCard>
    <div class="flex flex-col items-center">
      <p class="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
        {{ pomodoro.faza === 'rad' ? 'Timer fokusa' : 'Pauza' }}
      </p>

      <BaseSelect
        v-if="prikaziIzbor"
        v-model="odabrani"
        :options="opcije"
        :disabled="pomodoro.radi"
        class="mt-3"
      />

      <p class="my-3 text-6xl font-bold text-sb-indigo tabular-nums">
        {{ pomodoro.prikaz }}
      </p>

      <div class="flex flex-wrap items-center justify-center gap-3">
        <BaseButton :disabled="pomodoro.radi || !spreman" @click="pomodoro.pokreni()">
          Pokreni
        </BaseButton>
        <BaseButton variant="secondary" :disabled="!pomodoro.radi" @click="pomodoro.zaustavi()">
          Pauza
        </BaseButton>
        <button
          class="cursor-pointer rounded-xl bg-slate-100 p-2.5 text-slate-600 transition hover:bg-slate-200"
          title="Vrati timer na početak"
          @click="pomodoro.resetiraj()"
        >
          <Icon name="reset" />
        </button>
      </div>

      <p class="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
        <Icon name="iskra" size="h-4 w-4" />
        {{ pomodoro.opisSesije }}
      </p>

      <p v-if="drugiPredmet" class="mt-2 text-xs text-slate-500">
        Timer je pokrenut za predmet {{ predmetiStore.predmetPoId(pomodoro.predmetId)?.naziv }}
      </p>
    </div>
  </BaseCard>
</template>
