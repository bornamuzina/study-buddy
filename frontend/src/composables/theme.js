import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { lokalnaTema, zapamtiTemu } from '../utils/theme'

const pregled = ref(null)
const lokalna = ref(lokalnaTema())

export function useTheme() {
  const auth = useAuthStore()

  const tema = computed(
    () => pregled.value ?? auth.korisnik?.preferencije?.tema ?? lokalna.value ?? 'svijetla',
  )

  const prikazi = (vrijednost) => (pregled.value = vrijednost)
  const ocisti = () => (pregled.value = null)

  function prebaci() {
    lokalna.value = tema.value === 'tamna' ? 'svijetla' : 'tamna'
    zapamtiTemu(lokalna.value)
  }

  return { tema, prikazi, ocisti, prebaci }
}
