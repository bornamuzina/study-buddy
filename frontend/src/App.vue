<script setup>
import { watch } from 'vue'
import ErrorToast from './components/ErrorToast.vue'
import { useTheme } from './composables/theme'

const TRAJANJE = 250

const { tema } = useTheme()

let odbrojavanje = null

watch(
  tema,
  (vrijednost, prethodna) => {
    const korijen = document.documentElement
    if (prethodna) {
      korijen.classList.add('prijelaz')
      clearTimeout(odbrojavanje)
      odbrojavanje = setTimeout(() => korijen.classList.remove('prijelaz'), TRAJANJE)
    }
    korijen.classList.toggle('tamna', vrijednost === 'tamna')
  },
  { immediate: true },
)
</script>

<template>
  <RouterView />
  <ErrorToast />
</template>
