<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Logo from './Logo.vue'
import Icon from './ui/Icon.vue'
import Avatar from './ui/Avatar.vue'
import { useAuthStore } from '../stores/auth'
import { useNotificationsStore } from '../stores/notifications'
import { useGreske } from '../composables/greske'
import { useTheme } from '../composables/theme'

defineProps({ izbornik: Boolean })

defineEmits(['izbornik'])

const auth = useAuthStore()
const obavijesti = useNotificationsStore()
const route = useRoute()
const { pokusaj } = useGreske()
const { tema, prebaci: prebaciTemu } = useTheme()

const prijavljen = computed(() => auth.prijavljen && !route.meta.gost)

const otvorene = ref(false)
const istaknute = ref([])

function prebaci() {
  otvorene.value = !otvorene.value
  if (!otvorene.value) return
  istaknute.value = obavijesti.nove.map((stavka) => stavka.id)
  pokusaj(obavijesti.oznaciVidjene)
}
</script>

<template>
  <header
    class="relative flex h-16 items-center justify-between bg-sb-surface px-4 shadow-sm tamna:border-b tamna:border-slate-200 sm:px-6 lg:px-12"
  >
    <div class="flex min-w-0 items-center gap-2 sm:gap-3">
      <button
        v-if="izbornik"
        class="shrink-0 cursor-pointer rounded-xl p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-sb-indigo lg:hidden"
        title="Otvori izbornik"
        @click="$emit('izbornik')"
      >
        <Icon name="izbornik" size="h-6 w-6" />
      </button>

      <RouterLink :to="prijavljen ? '/ploca' : '/'" class="min-w-0">
        <Logo size="text-lg sm:text-2xl" />
      </RouterLink>
    </div>

    <div class="flex shrink-0 items-center gap-3 sm:gap-4">
      <button
        v-if="!prijavljen"
        class="cursor-pointer rounded-xl p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-sb-indigo"
        :title="tema === 'tamna' ? 'Prebaci na svijetlu temu' : 'Prebaci na tamnu temu'"
        @click="prebaciTemu"
      >
        <Icon :name="tema === 'tamna' ? 'sunce' : 'mjesec'" size="h-6 w-6" />
      </button>

      <div v-if="prijavljen" class="relative">
        <button
          class="relative cursor-pointer rounded-xl p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-sb-indigo"
          title="Obavijesti"
          @click="prebaci"
        >
          <Icon name="zvono" size="h-6 w-6" />
          <span
            v-if="obavijesti.broj"
            class="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-sb-light"
          >
            {{ obavijesti.broj }}
          </span>
        </button>

        <template v-if="otvorene">
          <div class="fixed inset-0 z-40" @click="otvorene = false" />

          <div
            class="rounded-card fixed top-16 right-4 left-4 z-50 max-h-[70vh] overflow-y-auto bg-white p-4 shadow-lg ring-1 ring-slate-900/5 sm:absolute sm:top-11 sm:right-0 sm:left-auto sm:w-80"
          >
            <div class="mb-3 flex items-center justify-between">
              <p class="text-sm font-bold text-slate-900">Obavijesti</p>
              <RouterLink
                to="/postavke"
                class="text-xs font-semibold text-sb-indigo"
                @click="otvorene = false"
              >
                Postavke
              </RouterLink>
            </div>

            <div v-if="obavijesti.stavke.length" class="space-y-1">
              <RouterLink
                v-for="stavka in obavijesti.stavke"
                :key="stavka.id"
                :to="stavka.poveznica"
                class="flex gap-3 rounded-xl p-2 transition hover:bg-slate-100"
                @click="otvorene = false"
              >
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  :class="stavka.hitno ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-sb-indigo'"
                >
                  <Icon :name="stavka.ikona" size="h-4 w-4" />
                </span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-slate-800">{{ stavka.naslov }}</p>
                  <p class="text-xs text-slate-500">{{ stavka.opis }}</p>
                </div>
                <span
                  v-if="istaknute.includes(stavka.id)"
                  class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sb-indigo"
                />
              </RouterLink>
            </div>

            <p v-else class="px-2 py-3 text-sm text-slate-500">
              {{
                obavijesti.sveIskljuceno
                  ? 'Obavijesti o zadacima i ciljevima isključene su u Postavkama.'
                  : 'Nemate novih obavijesti.'
              }}
            </p>
          </div>
        </template>
      </div>

      <RouterLink v-if="prijavljen" to="/profil">
        <Avatar :ime="auth.korisnik.ime" size="h-9 w-9 text-xs" />
      </RouterLink>
    </div>
  </header>
</template>
