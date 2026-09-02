import { PRIORITETI, STATUSI } from '../data/constants'

export const bojePredmeta = {
  amber: {
    pozadina: 'bg-amber-100',
    tekst: 'text-amber-600',
    traka: 'bg-amber-500',
    hex: '#f59e0b',
  },
  teal: { pozadina: 'bg-teal-100', tekst: 'text-teal-600', traka: 'bg-teal-500', hex: '#14b8a6' },
  indigo: {
    pozadina: 'bg-indigo-100',
    tekst: 'text-sb-blue',
    traka: 'bg-sb-indigo',
    hex: '#24389c',
  },
  blue: { pozadina: 'bg-sky-100', tekst: 'text-sky-700', traka: 'bg-sky-500', hex: '#0284c7' },
  rose: { pozadina: 'bg-rose-100', tekst: 'text-rose-600', traka: 'bg-rose-500', hex: '#f43f5e' },
}

export const bojaPredmeta = (boja) => bojePredmeta[boja] ?? bojePredmeta.indigo

export const prioritetNaziv = {
  [PRIORITETI.VISOK]: 'Visok prioritet',
  [PRIORITETI.SREDNJI]: 'Srednji prioritet',
  [PRIORITETI.NIZAK]: 'Nizak prioritet',
}

export const prioritetBoja = {
  [PRIORITETI.VISOK]: 'red',
  [PRIORITETI.SREDNJI]: 'indigo',
  [PRIORITETI.NIZAK]: 'teal',
}

export const statusNaziv = {
  [STATUSI.NA_CEKANJU]: 'Na čekanju',
  [STATUSI.U_TIJEKU]: 'U tijeku',
  [STATUSI.ZAVRSENO]: 'Završeno',
}

export const isoDatum = (datum = new Date()) => datum.toISOString().slice(0, 10)

export const decimalni = (broj, mjesta) =>
  (mjesta === undefined ? String(broj) : Number(broj).toFixed(mjesta)).replace('.', ',')

export function sBrojem(broj, jednina, dvojina, mnozina) {
  if (!Number.isInteger(broj)) return `${decimalni(broj)} ${dvojina}`
  const zadnja = broj % 10
  const zadnjeDvije = broj % 100
  if (zadnja === 1 && zadnjeDvije !== 11) return `${broj} ${jednina}`
  if (zadnja >= 2 && zadnja <= 4 && (zadnjeDvije < 12 || zadnjeDvije > 14))
    return `${broj} ${dvojina}`
  return `${broj} ${mnozina}`
}

export function formatDatum(iso) {
  return new Date(iso).toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function danaDo(iso) {
  const rok = new Date(iso)
  rok.setHours(0, 0, 0, 0)
  const danas = new Date()
  danas.setHours(0, 0, 0, 0)
  return Math.round((rok - danas) / 86400000)
}

export function relativniRok(iso) {
  const dana = danaDo(iso)
  if (dana < 0) return `Rok prošao prije ${sBrojem(Math.abs(dana), 'dan', 'dana', 'dana')}`
  if (dana === 0) return 'Rok danas'
  if (dana === 1) return 'Rok sutra'
  if (dana < 7) return `Rok za ${dana} dana`
  if (dana < 14) return 'Rok za 1 tjedan'
  return `Rok ${formatDatum(iso)}`
}

export function prijeVremena(iso) {
  const minuta = Math.round((Date.now() - new Date(iso)) / 60000)
  if (minuta < 1) return 'upravo'
  if (minuta < 60) return `prije ${minuta} min`
  const sati = Math.round(minuta / 60)
  if (sati < 24) return `prije ${sati} h`
  const dana = Math.round(sati / 24)
  if (dana === 1) return 'jučer'
  if (dana < 7) return `prije ${dana} dana`
  return formatDatum(iso)
}

export function formatVelicina(kb) {
  if (kb < 1024) return `${Math.round(kb)} KB`
  if (kb < 1024 * 1024) return `${decimalni(kb / 1024, 1)} MB`
  return `${Math.round(kb / 1024 / 1024)} GB`
}

export function satiIMinute(minuta) {
  const sati = Math.floor(minuta / 60)
  const ostatak = minuta % 60
  if (!sati) return `${ostatak} min`
  return ostatak ? `${sati} h ${ostatak} min` : `${sati} h`
}
