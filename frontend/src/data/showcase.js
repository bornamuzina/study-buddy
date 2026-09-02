import { PRIORITETI, STATUSI } from './constants'

function danOd(pomak) {
  const datum = new Date()
  datum.setDate(datum.getDate() + pomak)
  const mjesec = String(datum.getMonth() + 1).padStart(2, '0')
  const dan = String(datum.getDate()).padStart(2, '0')
  return `${datum.getFullYear()}-${mjesec}-${dan}`
}

export const predmeti = [
  {
    predmetId: 'p1',
    naziv: 'Filozofija',
    opis: 'Epistemologija i logika',
    boja: 'amber',
    ikona: 'knjiga',
  },
  {
    predmetId: 'p2',
    naziv: 'Strukture podataka',
    opis: 'Računalne znanosti 202',
    boja: 'teal',
    ikona: 'ploca',
  },
  { predmetId: 'p3', naziv: 'Matematika', opis: 'Napredna analiza', boja: 'indigo', ikona: 'graf' },
  {
    predmetId: 'p4',
    naziv: 'Kvantna fizika',
    opis: 'Moderna fizika 301',
    boja: 'blue',
    ikona: 'iskra',
  },
]

export const zadaci = [
  {
    zadatakId: 'z1',
    predmetId: 'p2',
    naslov: 'Implementiraj rotaciju crveno-crnog stabla',
    opis: 'Lijeva i desna rotacija s testovima.',
    rokIzvrsenja: danOd(1),
    prioritet: PRIORITETI.VISOK,
    status: STATUSI.NA_CEKANJU,
  },
  {
    zadatakId: 'z2',
    predmetId: 'p2',
    naslov: 'Ponovi analizu složenosti heap sorta',
    opis: 'Najgori i prosječni slučaj.',
    rokIzvrsenja: danOd(4),
    prioritet: PRIORITETI.SREDNJI,
    status: STATUSI.U_TIJEKU,
  },
  {
    zadatakId: 'z3',
    predmetId: 'p4',
    naslov: 'Predaj lab. izvještaj: Dinamika fluida',
    opis: 'Kemijski laboratorij • Grupa B',
    rokIzvrsenja: danOd(0),
    prioritet: PRIORITETI.VISOK,
    status: STATUSI.NA_CEKANJU,
  },
  {
    zadatakId: 'z4',
    predmetId: 'p3',
    naslov: 'Riješi zbirku: redovi i konvergencija',
    opis: 'Poglavlja 4 do 7.',
    rokIzvrsenja: danOd(-2),
    prioritet: PRIORITETI.SREDNJI,
    status: STATUSI.U_TIJEKU,
  },
  {
    zadatakId: 'z5',
    predmetId: 'p1',
    naslov: 'Nacrt seminarskog rada iz epistemologije',
    opis: 'Moderna Europa • Završni projekt',
    rokIzvrsenja: danOd(9),
    prioritet: PRIORITETI.NIZAK,
    status: STATUSI.NA_CEKANJU,
  },
  {
    zadatakId: 'z6',
    predmetId: 'p1',
    naslov: 'Pročitaj Gettierov članak',
    opis: '',
    rokIzvrsenja: danOd(-7),
    prioritet: PRIORITETI.SREDNJI,
    status: STATUSI.ZAVRSENO,
  },
  {
    zadatakId: 'z7',
    predmetId: 'p3',
    naslov: 'Kolokvij iz derivacija',
    opis: '',
    rokIzvrsenja: danOd(-11),
    prioritet: PRIORITETI.VISOK,
    status: STATUSI.ZAVRSENO,
  },
  {
    zadatakId: 'z8',
    predmetId: 'p4',
    naslov: 'Vježbe: Schrödingerova jednadžba',
    opis: '',
    rokIzvrsenja: danOd(6),
    prioritet: PRIORITETI.NIZAK,
    status: STATUSI.NA_CEKANJU,
  },
]
