import { ref } from 'vue'
import { porukaGreske } from '../utils/errors'

const TRAJANJE = 6000

const poruka = ref('')
let odbrojavanje = null

export function useGreske() {
  function ocisti() {
    poruka.value = ''
    clearTimeout(odbrojavanje)
    odbrojavanje = null
  }

  function prikazi(iznimka) {
    const tekst = porukaGreske(iznimka)
    if (!tekst) return
    poruka.value = tekst
    clearTimeout(odbrojavanje)
    odbrojavanje = setTimeout(ocisti, TRAJANJE)
  }

  async function pokusaj(radnja) {
    try {
      await radnja()
      return true
    } catch (iznimka) {
      prikazi(iznimka)
      return false
    }
  }

  return { poruka, prikazi, pokusaj, ocisti }
}
