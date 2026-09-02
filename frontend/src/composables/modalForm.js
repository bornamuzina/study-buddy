import { ref, watch } from 'vue'

export function useModalForm(
  open,
  prazan,
  { stavka, spremi, nakon, pretvori, obavezno = 'naslov' },
) {
  const obrazac = ref({ ...prazan })

  watch(open, (otvoren) => {
    if (!otvoren) return
    const izvor = stavka?.() ?? {}
    obrazac.value = Object.fromEntries(
      Object.keys(prazan).map((polje) => [polje, izvor[polje] ?? prazan[polje]]),
    )
    nakon?.(obrazac.value)
  })

  function posalji() {
    const podaci = pretvori ? pretvori({ ...obrazac.value }) : { ...obrazac.value }
    if (!podaci || !podaci[obavezno].trim()) return
    spremi(podaci)
    open.value = false
  }

  return { obrazac, posalji }
}
