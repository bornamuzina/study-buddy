import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { porukaGreske } from '../utils/errors'

export function useAuthForm(akcija) {
  const auth = useAuthStore()
  const router = useRouter()

  const email = ref('')
  const lozinka = ref('')
  const poslano = ref(false)
  const salje = ref(false)
  const greska = ref('')

  const greskaEmaila = computed(() => {
    if (!poslano.value) return ''
    if (!email.value) return 'Unesite adresu e-pošte.'
    if (!/^\S+@\S+\.\S+$/.test(email.value)) return 'Adresa e-pošte nije ispravna.'
    return ''
  })

  const greskaLozinke = computed(() => {
    if (!poslano.value) return ''
    if (lozinka.value.length < 6) return 'Lozinka mora imati barem 6 znakova.'
    return ''
  })

  async function pokusaj(izvrsi) {
    greska.value = ''
    salje.value = true
    try {
      await izvrsi()
      router.push(auth.jeAdmin ? '/admin/pregled' : '/ploca')
    } catch (iznimka) {
      greska.value = porukaGreske(iznimka)
    }
    salje.value = false
  }

  function posalji() {
    poslano.value = true
    if (greskaEmaila.value || greskaLozinke.value) return
    pokusaj(() => auth[akcija](email.value, lozinka.value))
  }

  function google() {
    pokusaj(() => auth.prijavaGoogle())
  }

  return { email, lozinka, salje, greska, greskaEmaila, greskaLozinke, posalji, google }
}
