export const uzlazno = (kljuc) => (prvi, drugi) => prvi[kljuc].localeCompare(drugi[kljuc])

export const silazno = (kljuc) => (prvi, drugi) => drugi[kljuc].localeCompare(prvi[kljuc])
