const KLJUC = 'sb-tema'

export function lokalnaTema() {
  const tema = localStorage.getItem(KLJUC)
  return tema === 'tamna' || tema === 'svijetla' ? tema : null
}

export function zapamtiTemu(tema) {
  localStorage.setItem(KLJUC, tema)
}
