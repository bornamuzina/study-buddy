<script setup>
import { onBeforeUnmount, watch } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseSelect from '../components/ui/BaseSelect.vue'
import BaseToggle from '../components/ui/BaseToggle.vue'
import Icon from '../components/ui/Icon.vue'
import IconTile from '../components/ui/IconTile.vue'
import PageHeading from '../components/ui/PageHeading.vue'
import SaveBar from '../components/SaveBar.vue'
import { useProfileForm } from '../composables/profileForm'
import { useTheme } from '../composables/theme'
import { POMODORO_ZADANO, useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const pocetno = () => ({
  preferencije: { ...auth.korisnik.preferencije },
  obavijesti: { ...auth.korisnik.obavijesti },
  pomodoro: { ...POMODORO_ZADANO, ...auth.korisnik.pomodoro },
})

const pretvori = (podaci) => ({
  ...podaci,
  pomodoro: {
    ...podaci.pomodoro,
    minutaRada: Number(podaci.pomodoro.minutaRada),
    minutaPauze: Number(podaci.pomodoro.minutaPauze),
  },
})

const { obrazac, promijenjeno, spremljeno, spremi, odbaci } = useProfileForm(pocetno, pretvori)

const { prikazi, ocisti } = useTheme()

watch(() => obrazac.value.preferencije.tema, prikazi)

onBeforeUnmount(ocisti)

async function spremiPostavke() {
  await spremi()
  ocisti()
}

function odbaciPostavke() {
  odbaci()
  ocisti()
}

const jezikOpcije = [{ value: 'hr', label: 'Hrvatski' }]

const obavijestiStavke = [
  {
    kljuc: 'podsjetnici',
    ikona: 'kvacica',
    naslov: 'Podsjetnici za zadatke',
    opis: 'Zadaci kojima rok istječe pojavljuju se u zvonu.',
  },
  {
    kljuc: 'pauze',
    ikona: 'sat',
    naslov: 'Pomodoro pauze',
    opis: 'Zvučna obavijest kada sesija fokusa završi.',
  },
  {
    kljuc: 'ciljevi',
    ikona: 'pehar',
    naslov: 'Obavijesti o ciljevima učenja',
    opis: 'Zvono javlja kada se dnevni cilj približi ili ispuni.',
  },
]
</script>

<template>
  <div>
    <PageHeading
      title="Postavke"
      subtitle="Izgled sučelja, trajanje Pomodoro sesija i obavijesti."
    />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <BaseCard>
        <p class="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
          <Icon name="postavke" />
          Preferencije
        </p>

        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-600">Jezik</span>
          <BaseSelect v-model="obrazac.preferencije.jezik" :options="jezikOpcije" />
        </div>

        <div class="mt-4 flex items-center justify-between">
          <span class="text-sm text-slate-600">Tema sučelja</span>
          <div class="flex rounded-xl bg-slate-100 p-1">
            <button
              v-for="tema in ['svijetla', 'tamna']"
              :key="tema"
              class="cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition"
              :class="
                obrazac.preferencije.tema === tema
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500'
              "
              @click="obrazac.preferencije.tema = tema"
            >
              {{ tema }}
            </button>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <p class="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
          <Icon name="sat" />
          Pomodoro
        </p>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BaseInput v-model="obrazac.pomodoro.minutaRada" label="Sesija (min)" type="number" />
          <BaseInput v-model="obrazac.pomodoro.minutaPauze" label="Pauza (min)" type="number" />
        </div>

        <div class="mt-4 flex items-center justify-between gap-4">
          <span class="text-sm text-slate-600">Pauza kreće automatski</span>
          <BaseToggle v-model="obrazac.pomodoro.automatskiNastavak" />
        </div>
      </BaseCard>
    </div>

    <BaseCard class="mt-6">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div>
          <p class="text-2xl font-bold text-slate-900">Obavijesti</p>
          <p class="mt-2 text-sm text-slate-500">
            Upravljajte time kako i kada primate obavijesti o sesijama učenja i ciljevima.
          </p>
        </div>

        <div class="space-y-3 lg:col-span-2">
          <div
            v-for="stavka in obavijestiStavke"
            :key="stavka.kljuc"
            class="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4"
          >
            <IconTile :name="stavka.ikona" class="bg-white text-sb-indigo" />
            <div class="flex-1">
              <p class="text-sm font-semibold text-slate-800">
                {{ stavka.naslov }}
              </p>
              <p class="text-xs text-slate-500">{{ stavka.opis }}</p>
            </div>
            <BaseToggle v-model="obrazac.obavijesti[stavka.kljuc]" />
          </div>
        </div>
      </div>
    </BaseCard>

    <SaveBar
      :promijenjeno="promijenjeno"
      :spremljeno="spremljeno"
      @spremi="spremiPostavke"
      @odbaci="odbaciPostavke"
    />
  </div>
</template>
