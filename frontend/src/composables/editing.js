import { reactive, ref } from 'vue'
import { useGreske } from './greske'

export function useEditing(dodaj, uredi, kljuc) {
  const { pokusaj } = useGreske()

  const otvoren = ref(false)
  const stavka = ref(null)

  function otvoriNovu() {
    stavka.value = null
    otvoren.value = true
  }

  function otvoriUredi(postojeca) {
    stavka.value = postojeca
    otvoren.value = true
  }

  function spremi(podaci) {
    const postojeca = stavka.value
    return pokusaj(() => (postojeca ? uredi(postojeca[kljuc], podaci) : dodaj(podaci)))
  }

  return reactive({ otvoren, stavka, otvoriNovu, otvoriUredi, spremi })
}
