import { NAJVECI_PRILOG_KB } from '../data/constants'
import { formatVelicina } from './format'

const PORUKE = {
  'auth/invalid-email': 'Adresa e-pošte nije ispravna.',
  'auth/user-not-found': 'Pogrešna adresa e-pošte ili lozinka.',
  'auth/wrong-password': 'Pogrešna adresa e-pošte ili lozinka.',
  'auth/invalid-credential': 'Pogrešna adresa e-pošte ili lozinka.',
  'auth/user-disabled': 'Račun je deaktiviran.',
  'auth/email-already-in-use': 'Račun s tom adresom već postoji.',
  'auth/weak-password': 'Lozinka mora imati barem 6 znakova.',
  'auth/too-many-requests': 'Previše pokušaja. Pokušajte ponovno kasnije.',
  'auth/network-request-failed': 'Nema veze s poslužiteljem.',
  'auth/requires-recent-login': 'Odjavite se i prijavite ponovno, pa pokušajte opet.',
  'auth/provider-already-linked': 'Lozinka je već postavljena za ovaj račun.',
  'auth/credential-already-in-use': 'Ta je adresa već vezana uz drugi način prijave.',
  'auth/popup-closed-by-user': '',
  'auth/cancelled-popup-request': '',
  'permission-denied': 'Nemate ovlasti za tu radnju.',
  'not-found': 'Zapis više ne postoji.',
  unavailable: 'Nema veze s poslužiteljem.',
  'resource-exhausted': 'Dosegnuto je ograničenje baze. Pokušajte ponovno kasnije.',
  'storage/unauthorized': 'Nemate ovlasti nad tom datotekom.',
  'storage/unauthenticated': 'Prijavite se ponovno pa pokušajte opet.',
  'storage/object-not-found': 'Datoteka više ne postoji.',
  'storage/quota-exceeded': 'Prostor za pohranu je popunjen.',
  'storage/retry-limit-exceeded': 'Slanje datoteke nije uspjelo. Pokušajte ponovno.',
  'storage/canceled': '',
  'app/prilog-prevelik': `Datoteka je prevelika. Najviše ${formatVelicina(NAJVECI_PRILOG_KB)} po prilogu.`,
}

export const greska = (kod) => Object.assign(new Error(kod), { code: kod })

export function porukaGreske(iznimka) {
  return PORUKE[iznimka?.code] ?? 'Nešto je pošlo po zlu. Pokušajte ponovno.'
}
