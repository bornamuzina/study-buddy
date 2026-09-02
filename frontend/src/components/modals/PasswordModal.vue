<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'

const props = defineProps({ promjena: Boolean, salje: Boolean, greska: String })

const emit = defineEmits(['spremi'])

const open = defineModel({ type: Boolean })

const trenutna = ref('')
const nova = ref('')
const potvrda = ref('')
const poslano = ref(false)

watch(open, (vrijednost) => {
  if (!vrijednost) return
  trenutna.value = ''
  nova.value = ''
  potvrda.value = ''
  poslano.value = false
})

const greskaTrenutne = computed(() => {
  if (!poslano.value || !props.promjena) return ''
  return trenutna.value ? '' : 'Unesite trenutnu lozinku.'
})

const greskaNove = computed(() => {
  if (!poslano.value) return ''
  return nova.value.length < 6 ? 'Lozinka mora imati barem 6 znakova.' : ''
})

const greskaPotvrde = computed(() => {
  if (!poslano.value) return ''
  return nova.value !== potvrda.value ? 'Lozinke se ne podudaraju.' : ''
})

function posalji() {
  poslano.value = true
  if (greskaTrenutne.value || greskaNove.value || greskaPotvrde.value) return
  emit('spremi', { trenutna: trenutna.value, nova: nova.value })
}
</script>

<template>
  <BaseModal v-model="open" :title="promjena ? 'Promjena lozinke' : 'Postavljanje lozinke'">
    <form class="space-y-4" @submit.prevent="posalji">
      <p class="text-sm text-slate-500">
        {{
          promjena
            ? 'Radi sigurnosti prvo potvrdite trenutnu lozinku.'
            : 'Nakon postavljanja lozinke moći ćete se prijaviti i adresom e-pošte, uz postojeću prijavu Google računom.'
        }}
      </p>

      <BaseInput
        v-if="promjena"
        v-model="trenutna"
        label="Trenutna lozinka"
        type="password"
        :error="greskaTrenutne"
      />
      <BaseInput
        v-model="nova"
        label="Nova lozinka"
        type="password"
        :error="greskaNove"
        placeholder="barem 6 znakova"
      />
      <BaseInput
        v-model="potvrda"
        label="Ponovite novu lozinku"
        type="password"
        :error="greskaPotvrde"
      />

      <p v-if="greska" class="text-sm text-red-600">{{ greska }}</p>

      <div class="flex justify-end gap-3 pt-2">
        <BaseButton type="button" variant="ghost" @click="open = false">Odustani</BaseButton>
        <BaseButton type="submit" :disabled="salje">
          {{ salje ? 'Spremanje...' : promjena ? 'Promijeni lozinku' : 'Postavi lozinku' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
