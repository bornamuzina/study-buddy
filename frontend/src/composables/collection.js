import { ref, watch } from 'vue'
import { onSnapshot } from 'firebase/firestore'

export function useCollection(uvjet, zbirka, kljuc, { sortiraj, nakon, priPrekidu } = {}) {
  const stavke = ref([])
  const ucitavanje = ref(true)

  let odjava = null

  function prekini() {
    if (odjava) odjava()
    odjava = null
    stavke.value = []
    priPrekidu?.()
  }

  watch(
    uvjet,
    (vrijedi) => {
      prekini()
      if (!vrijedi) return
      ucitavanje.value = true
      odjava = onSnapshot(zbirka(), (snimka) => {
        const dohvaceni = snimka.docs.map((dokument) => ({
          [kljuc]: dokument.id,
          ...dokument.data(),
        }))
        stavke.value = sortiraj ? dohvaceni.sort(sortiraj) : dohvaceni
        nakon?.(stavke.value)
        ucitavanje.value = false
      })
    },
    { immediate: true },
  )

  return { stavke, ucitavanje }
}
