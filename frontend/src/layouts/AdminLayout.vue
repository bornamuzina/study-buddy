<script setup>
import Logo from '../components/Logo.vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/ui/Icon.vue'
import Avatar from '../components/ui/Avatar.vue'
import { useLogout } from '../composables/logout'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const odjava = useLogout()

const stavke = [
  { to: '/admin/pregled', naziv: 'Pregled' },
  { to: '/admin/korisnici', naziv: 'Upravljanje korisnicima' },
  { to: '/ploca', naziv: 'Moj studij' },
]
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <template v-if="auth.prijavljen">
      <header
        class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 bg-sb-surface px-4 py-3 shadow-sm tamna:border-b tamna:border-slate-200 sm:px-6 lg:h-16 lg:flex-nowrap lg:px-12 lg:py-0"
      >
        <Logo size="text-lg sm:text-2xl" />

        <nav
          class="order-last flex w-full gap-5 overflow-x-auto whitespace-nowrap lg:order-0 lg:ml-10 lg:w-auto lg:flex-1 lg:gap-6 lg:overflow-visible"
        >
          <RouterLink
            v-for="stavka in stavke"
            :key="stavka.to"
            :to="stavka.to"
            class="text-sm text-slate-500 transition hover:text-sb-blue"
            active-class="font-semibold text-sb-blue underline underline-offset-8"
          >
            {{ stavka.naziv }}
          </RouterLink>
        </nav>

        <div class="flex items-center gap-4">
          <Icon name="zvono" size="h-6 w-6 text-slate-500" />
          <button class="cursor-pointer text-sm text-slate-500 hover:text-sb-blue" @click="odjava">
            Odjava
          </button>
          <RouterLink to="/profil">
            <Avatar :ime="auth.korisnik.ime" size="h-9 w-9 text-xs" />
          </RouterLink>
        </div>
      </header>

      <main class="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-12 lg:py-10">
        <RouterView />
      </main>
    </template>

    <Footer />
  </div>
</template>
