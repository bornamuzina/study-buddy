<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Icon from './ui/Icon.vue'
import Avatar from './ui/Avatar.vue'
import BaseButton from './ui/BaseButton.vue'
import PomodoroModal from './modals/PomodoroModal.vue'
import { useLogout } from '../composables/logout'
import { useAuthStore } from '../stores/auth'
import { usePomodoroStore } from '../stores/pomodoro'

const props = defineProps({ samoDrawer: Boolean })

const auth = useAuthStore()
const pomodoro = usePomodoroStore()
const route = useRoute()
const odjava = useLogout()

const otvoren = defineModel({ type: Boolean, default: false })
const pomodoroModal = ref(false)

watch(
  () => route.path,
  () => (otvoren.value = false),
)

const stavke = computed(() => [
  { to: '/ploca', ikona: 'ploca', naziv: 'Nadzorna ploča' },
  { to: '/predmeti', ikona: 'knjiga', naziv: 'Predmeti' },
  { to: '/statistika', ikona: 'graf', naziv: 'Statistika' },
  { to: '/novosti', ikona: 'iskra', naziv: 'Novosti' },
  { to: '/profil', ikona: 'korisnik', naziv: 'Profil' },
  ...(auth.jeAdmin ? [{ to: '/admin/pregled', ikona: 'stit', naziv: 'Administracija' }] : []),
])

const prikaziPomodoro = computed(() => route.path !== '/ploca')

const stanjeSesije = computed(() => {
  if (!pomodoro.radi) return null
  return pomodoro.faza === 'rad'
    ? { naziv: 'Deep work mode', razred: 'bg-indigo-100 text-sb-blue', tocka: 'bg-sb-indigo' }
    : { naziv: 'Pauza u tijeku', razred: 'bg-teal-100 text-sb-teal', tocka: 'bg-sb-teal' }
})

const razredSirine = computed(() =>
  props.samoDrawer
    ? 'lg:hidden'
    : 'lg:static lg:translate-x-0 lg:overflow-visible lg:transition-none',
)
</script>

<template>
  <div v-if="otvoren" class="fixed inset-0 z-40 bg-black/50 lg:hidden" @click="otvoren = false" />

  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col justify-between overflow-y-auto bg-sb-bg px-6 py-8 transition-transform duration-200"
    :class="[razredSirine, otvoren ? 'translate-x-0' : '-translate-x-full']"
  >
    <div>
      <div class="mb-6 flex items-center gap-3">
        <Avatar :ime="auth.korisnik.ime" />
        <div>
          <p class="font-semibold text-slate-800">
            {{ auth.korisnik.ime.split(' ')[0] }}
          </p>
          <p
            v-if="stanjeSesije"
            class="mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-bold"
            :class="stanjeSesije.razred"
          >
            <span
              class="h-1.5 w-1.5 animate-pulse rounded-full motion-reduce:animate-none"
              :class="stanjeSesije.tocka"
            />
            {{ stanjeSesije.naziv }}
          </p>
        </div>
      </div>

      <template v-if="prikaziPomodoro">
        <BaseButton v-if="!pomodoro.radi" block class="mb-8" @click="pomodoroModal = true">
          Pokreni Pomodoro
        </BaseButton>
        <RouterLink
          v-else
          to="/ploca"
          class="rounded-card mb-8 block bg-sb-indigo px-4 py-3 text-center text-sb-light"
        >
          <span class="text-2xl font-bold tabular-nums">{{ pomodoro.prikaz }}</span>
          <span class="mt-0.5 block text-xs opacity-80">
            {{ pomodoro.faza === 'rad' ? 'Fokus u tijeku' : 'Pauza' }}
          </span>
        </RouterLink>
      </template>

      <nav class="flex flex-col gap-1">
        <RouterLink
          v-for="stavka in stavke"
          :key="stavka.to"
          :to="stavka.to"
          class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-white"
          active-class="bg-indigo-100 text-sb-blue"
        >
          <Icon :name="stavka.ikona" />
          {{ stavka.naziv }}
        </RouterLink>
      </nav>
    </div>

    <div>
      <BaseButton variant="secondary" block class="mb-4" @click="odjava">Odjava</BaseButton>
      <div class="flex flex-col gap-1 border-t border-slate-200 pt-4">
        <RouterLink
          to="/postavke"
          class="flex items-center gap-3 rounded-xl px-4 py-2 text-sm text-slate-500 transition hover:bg-white hover:text-sb-indigo"
          active-class="bg-indigo-100 text-sb-blue"
        >
          <Icon name="postavke" />
          Postavke
        </RouterLink>
        <RouterLink
          to="/pomoc"
          class="flex items-center gap-3 rounded-xl px-4 py-2 text-sm text-slate-500 transition hover:bg-white hover:text-sb-indigo"
          active-class="bg-indigo-100 text-sb-blue"
        >
          <Icon name="pomoc" />
          Pomoć
        </RouterLink>
      </div>
    </div>
  </aside>

  <PomodoroModal v-model="pomodoroModal" />
</template>
