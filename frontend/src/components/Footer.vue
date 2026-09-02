<script setup>
import Logo from './Logo.vue'

const poveznice = [
  { to: '/o-nama', naziv: 'O nama' },
  { to: '/kontakt', naziv: 'Kontakt' },
  { to: '/privatnost', naziv: 'Privatnost' },
  { to: '/uvjeti', naziv: 'Uvjeti' },
]
</script>

<template>
  <footer
    class="flex w-full flex-col items-center gap-4 bg-sb-surface px-4 py-6 text-center text-sm text-slate-500 sm:px-6 lg:h-16 lg:flex-row lg:justify-between lg:gap-0 lg:px-12 lg:py-0 lg:text-left"
  >
    <div class="lg:w-1/3">
      <Logo :icon="false" size="text-xl" />
    </div>

    <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:w-1/3">
      <RouterLink
        v-for="poveznica in poveznice"
        :key="poveznica.to"
        :to="poveznica.to"
        class="transition hover:text-sb-indigo"
      >
        {{ poveznica.naziv }}
      </RouterLink>
    </div>

    <p class="lg:w-1/3 lg:text-right">© 2026 StudyBuddy. Sva prava pridržana.</p>
  </footer>
</template>
