import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useGreske } from './greske'

export function useProfileForm(pocetno, pretvori = (podaci) => podaci) {
  const auth = useAuthStore()
  const { pokusaj } = useGreske()

  const obrazac = ref(pocetno())
  const spremljeno = ref(false)

  const zaSpremanje = () => pretvori(obrazac.value)
  const promijenjeno = computed(
    () => JSON.stringify(zaSpremanje()) !== JSON.stringify(pretvori(pocetno())),
  )

  async function spremi() {
    if (!(await pokusaj(() => auth.azuriraj(zaSpremanje())))) return
    spremljeno.value = true
    setTimeout(() => (spremljeno.value = false), 2500)
  }

  function odbaci() {
    obrazac.value = pocetno()
  }

  return { obrazac, promijenjeno, spremljeno, spremi, odbaci }
}
