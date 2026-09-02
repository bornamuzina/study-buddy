import { computed, ref, watch } from 'vue'

export function usePagination(stavke, poStranici) {
  const stranica = ref(1)

  const brojStranica = computed(() => Math.max(1, Math.ceil(stavke.value.length / poStranici)))

  const stranicaStavki = computed(() =>
    stavke.value.slice((stranica.value - 1) * poStranici, stranica.value * poStranici),
  )

  watch(brojStranica, (broj) => {
    if (stranica.value > broj) stranica.value = broj
  })

  return { stranica, brojStranica, stranicaStavki }
}
