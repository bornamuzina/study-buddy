import { ref } from 'vue'

export function useConfirm() {
  const upit = ref(null)
  let razrijesi = null

  function pitaj(opcije) {
    upit.value = { gumb: 'Potvrdi', opasno: true, ...opcije }
    return new Promise((resolve) => (razrijesi = resolve))
  }

  function odgovori(odgovor) {
    upit.value = null
    razrijesi?.(odgovor)
    razrijesi = null
  }

  return { upit, pitaj, odgovori }
}
