import { deleteApp, initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth'
import { collection, doc, getDocs, getFirestore, updateDoc, writeBatch } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref as mjestoDatoteke, uploadBytes } from 'firebase/storage'
import { db, konfiguracija, spremiste } from '../firebase'
import { PREDLOZAK, useAuthStore } from '../stores/auth'
import { predmeti as izlogPredmeti, zadaci as izlogZadaci } from './showcase'
import { PRIORITETI, STATUSI } from './constants'
import { bojaPredmeta, isoDatum } from '../utils/format'

const TJEDANA = 8
const NEDAVNIH_DANA = 7
const VELICINA_SERIJE = 400
const TRAJANJA = [20, 25, 25, 30, 45, 50]
const SIRINA_SLIKE = 640
const VISINA_SLIKE = 360

const DODATNI_PREDMETI = [
  {
    predmetId: 'p5',
    naziv: 'Programsko inženjerstvo',
    opis: 'Vue 3, Firebase i timski rad',
    boja: 'rose',
    ikona: 'ploca',
  },
  {
    predmetId: 'p6',
    naziv: 'Baze podataka',
    opis: 'Relacijski model i SQL',
    boja: 'teal',
    ikona: 'graf',
  },
  {
    predmetId: 'p7',
    naziv: 'Engleski jezik struke',
    opis: 'Tehnička terminologija',
    boja: 'amber',
    ikona: 'knjiga',
  },
]

const DODATNI_ZADACI = [
  {
    predmetId: 'p3',
    naslov: 'Zadaća 6: višestruki integrali',
    opis: 'Fubinijev teorem i zamjena varijabli.',
    pomak: 2,
    prioritet: PRIORITETI.SREDNJI,
    status: STATUSI.U_TIJEKU,
  },
  {
    predmetId: 'p5',
    naslov: 'Postavi Firestore sigurnosna pravila',
    opis: 'Vlasnik piše svoje, administrator vidi sve.',
    pomak: 2,
    prioritet: PRIORITETI.VISOK,
    status: STATUSI.NA_CEKANJU,
  },
  {
    predmetId: 'p5',
    naslov: 'Napiši dokumentaciju arhitekture',
    opis: 'Dijagram slojeva i opis storeova.',
    pomak: 5,
    prioritet: PRIORITETI.SREDNJI,
    status: STATUSI.U_TIJEKU,
  },
  {
    predmetId: 'p5',
    naslov: 'Pregled tuđeg modula',
    opis: '',
    pomak: -3,
    prioritet: PRIORITETI.SREDNJI,
    status: STATUSI.ZAVRSENO,
  },
  {
    predmetId: 'p5',
    naslov: 'Prezentacija prototipa',
    opis: 'Petnaest minuta uživo pred mentorom.',
    pomak: 12,
    prioritet: PRIORITETI.VISOK,
    status: STATUSI.NA_CEKANJU,
  },
  {
    predmetId: 'p6',
    naslov: 'Normaliziraj shemu do 3NF',
    opis: 'Ukloni tranzitivne ovisnosti.',
    pomak: 3,
    prioritet: PRIORITETI.VISOK,
    status: STATUSI.U_TIJEKU,
  },
  {
    predmetId: 'p6',
    naslov: 'Zadaća: složeni JOIN upiti',
    opis: 'Vanjska spajanja i agregacije.',
    pomak: -1,
    prioritet: PRIORITETI.SREDNJI,
    status: STATUSI.NA_CEKANJU,
  },
  {
    predmetId: 'p6',
    naslov: 'Ponovi transakcije i razine izolacije',
    opis: '',
    pomak: 8,
    prioritet: PRIORITETI.NIZAK,
    status: STATUSI.NA_CEKANJU,
  },
  {
    predmetId: 'p7',
    naslov: 'Sažetak članka o mikroservisima',
    opis: 'Tristo riječi, vlastitim riječima.',
    pomak: 1,
    prioritet: PRIORITETI.SREDNJI,
    status: STATUSI.NA_CEKANJU,
  },
  {
    predmetId: 'p7',
    naslov: 'Usmena prezentacija: AI u obrazovanju',
    opis: '',
    pomak: 7,
    prioritet: PRIORITETI.VISOK,
    status: STATUSI.NA_CEKANJU,
  },
  {
    predmetId: 'p7',
    naslov: 'Vokabular: 50 tehničkih pojmova',
    opis: '',
    pomak: -5,
    prioritet: PRIORITETI.NIZAK,
    status: STATUSI.ZAVRSENO,
  },
]

const BILJESKE = [
  {
    predmetId: 'p1',
    kategorija: 'Koncepti',
    naslov: 'Gettierov problem',
    sadrzaj:
      'Opravdano istinito vjerovanje nije dovoljno za znanje. Slučajevi u kojima je vjerovanje istinito iz pogrešnog razloga.',
    pomak: -18,
  },
  {
    predmetId: 'p1',
    kategorija: 'Seminar',
    naslov: 'Münchhausenova trilema',
    sadrzaj: 'Svaki lanac opravdanja završi u regresu, krugu ili neopravdanom aksiomu.',
    pomak: -9,
  },
  {
    predmetId: 'p1',
    kategorija: 'Etika',
    naslov: 'Kategorički imperativ',
    sadrzaj: 'Postupaj samo prema onoj maksimi za koju možeš htjeti da postane opći zakon.',
    pomak: -3,
  },
  {
    predmetId: 'p2',
    kategorija: 'Strukture',
    naslov: 'Kolizije hash tablice',
    sadrzaj:
      'Ulančavanje protiv otvorenog adresiranja. Faktor popunjenosti iznad 0.75 traži rehashiranje.',
    pomak: -21,
  },
  {
    predmetId: 'p2',
    kategorija: 'Strukture',
    naslov: 'Crveno-crno stablo',
    sadrzaj: 'Pet invarijanti, rotacije i prebojavanje pri umetanju. Visina ostaje logaritamska.',
    pomak: -6,
  },
  {
    predmetId: 'p2',
    kategorija: 'Složenost',
    naslov: 'Amortizirana analiza',
    sadrzaj: 'Dinamički niz udvostručuje kapacitet, pa je dodavanje O(1) amortizirano.',
    pomak: -2,
  },
  {
    predmetId: 'p3',
    kategorija: 'Analiza',
    naslov: 'Kriteriji konvergencije',
    sadrzaj: "D'Alembertov i Cauchyjev kriterij, usporedni test i apsolutna konvergencija.",
    pomak: -14,
  },
  {
    predmetId: 'p3',
    kategorija: 'Analiza',
    naslov: 'Taylorov red',
    sadrzaj: 'Razvoj oko nule i ostatak u Lagrangeovom obliku.',
    pomak: -4,
  },
  {
    predmetId: 'p3',
    kategorija: 'Vježbe',
    naslov: 'Parcijalna integracija',
    sadrzaj: 'Biraj u tako da derivacija pojednostavni izraz, a dv da se lako integrira.',
    pomak: -1,
  },
  {
    predmetId: 'p4',
    kategorija: 'Ispit',
    naslov: 'Schrödingerova jednadžba',
    sadrzaj: 'Vremenski neovisan oblik, svojstvene vrijednosti energije i rubni uvjeti.',
    pomak: -11,
  },
  {
    predmetId: 'p4',
    kategorija: 'Koncepti',
    naslov: 'Načelo neodređenosti',
    sadrzaj: 'Umnožak nesigurnosti položaja i impulsa ima donju granicu.',
    pomak: -5,
  },
  {
    predmetId: 'p4',
    kategorija: 'Laboratorij',
    naslov: 'Tuneliranje kroz barijeru',
    sadrzaj: 'Vjerojatnost pada eksponencijalno s debljinom barijere.',
    pomak: -1,
  },
  {
    predmetId: 'p5',
    kategorija: 'Vue',
    naslov: 'Composition API i script setup',
    sadrzaj: 'Logika se dijeli u composable funkcije umjesto u mixine.',
    pomak: -16,
  },
  {
    predmetId: 'p5',
    kategorija: 'Firebase',
    naslov: 'Listeneri i odjava pretplate',
    sadrzaj: 'Svaki onSnapshot vraća funkciju za odjavu. Bez nje pretplate ostaju otvorene.',
    pomak: -8,
  },
  {
    predmetId: 'p5',
    kategorija: 'Proces',
    naslov: 'Konvencije za commit poruke',
    sadrzaj: 'Kratak naslov u imperativu, tijelo objašnjava zašto, ne što.',
    pomak: -2,
  },
  {
    predmetId: 'p6',
    kategorija: 'Teorija',
    naslov: 'ACID svojstva',
    sadrzaj: 'Atomarnost, konzistentnost, izolacija i trajnost transakcije.',
    pomak: -19,
  },
  {
    predmetId: 'p6',
    kategorija: 'Optimizacija',
    naslov: 'Indeksi i plan izvršavanja',
    sadrzaj: 'Indeks ubrzava čitanje, usporava pisanje. EXPLAIN pokazuje stvarni plan.',
    pomak: -10,
  },
  {
    predmetId: 'p6',
    kategorija: 'Teorija',
    naslov: 'Strani ključevi i kaskadno brisanje',
    sadrzaj: 'ON DELETE CASCADE briše djecu, ON DELETE RESTRICT sprječava brisanje roditelja.',
    pomak: -3,
  },
  {
    predmetId: 'p7',
    kategorija: 'Gramatika',
    naslov: 'Pasiv u tehničkom pisanju',
    sadrzaj: 'Pasiv miče izvršitelja iz fokusa, ali pretjerivanje čini tekst nejasnim.',
    pomak: -13,
  },
  {
    predmetId: 'p7',
    kategorija: 'Vokabular',
    naslov: 'Lažni prijatelji',
    sadrzaj: 'Eventually nije eventualno, actually nije aktualno, control nije kontrola.',
    pomak: -7,
  },
  {
    predmetId: 'p7',
    kategorija: 'Pisanje',
    naslov: 'Struktura sažetka rada',
    sadrzaj: 'Kontekst, problem, metoda, rezultat, zaključak. Jedna rečenica po dijelu.',
    pomak: -1,
  },
]

const LITERATURA = [
  'Cormen, Leiserson, Rivest, Stein - Introduction to Algorithms',
  'Fowler - Refactoring: Improving the Design of Existing Code',
  'Kleppmann - Designing Data-Intensive Applications',
  'Silberschatz, Korth, Sudarshan - Database System Concepts',
  'Hunt, Thomas - The Pragmatic Programmer',
]

const OBJAVE = [
  {
    tip: 'Obavijest',
    naslov: 'StudyBuddy sada pamti temu sučelja',
    sadrzaj: 'Odabrana tema ostaje zapamćena i kada niste prijavljeni.',
    vidljiv: true,
    pomak: -1,
    dodatniGlasovi: { sjeme1: 1, sjeme2: 1, sjeme3: 1 },
  },
  {
    tip: 'Savjet',
    naslov: 'Kako složiti tjedni raspored učenja',
    sadrzaj:
      'Rasporedite teže kolegije u sate kada ste najodmorniji, a ponavljanje ostavite za kraj dana.',
    vidljiv: true,
    pomak: -4,
    dodatniGlasovi: { sjeme1: 1, sjeme2: -1 },
  },
  {
    tip: 'Događanje',
    naslov: 'Radionica: tehnike pamćenja',
    sadrzaj: 'Termin je u petak u 18 sati, prijave preko poveznice.',
    vidljiv: true,
    pomak: -7,
    dodatniGlasovi: { sjeme1: 1, sjeme2: 1, sjeme3: -1, sjeme4: 1 },
  },
  {
    tip: 'Ažuriranje',
    naslov: 'Statistika prati tjedne trendove',
    sadrzaj: 'Grafovi sada uspoređuju odrađene sate s prošlim tjednom.',
    vidljiv: true,
    pomak: -12,
    dodatniGlasovi: { sjeme1: -1 },
  },
  {
    tip: 'Obavijest',
    naslov: 'Planirano održavanje baze',
    sadrzaj: 'Objava je skrivena dok se termin ne potvrdi.',
    vidljiv: false,
    pomak: -15,
    dodatniGlasovi: {},
  },
]

const PREDMETI = [...izlogPredmeti, ...DODATNI_PREDMETI]

const DOMENA = 'fakemail.com'
const lozinka = () => crypto.randomUUID()
const TJEDANA_KORISNIKA = 3
const ADMINA = 2
const DEAKTIVIRANIH = 3

const IMENA = [
  'Ana Horvat',
  'Ivan Kovačević',
  'Marija Novak',
  'Luka Babić',
  'Petra Marić',
  'Filip Jurić',
  'Dora Vuković',
  'Matej Knežević',
  'Lucija Pavić',
  'Karlo Blažević',
  'Nika Grgić',
  'Josip Šarić',
  'Klara Bošnjak',
  'Toma Perić',
  'Iva Radić',
  'Bruno Matić',
  'Lana Barišić',
  'Domagoj Vidović',
  'Sara Tomić',
  'Roko Filipović',
  'Ema Lovrić',
  'Vito Jukić',
  'Tena Bilić',
  'Mislav Crnčević',
]

const SVEUCILISTA = [
  'Sveučilište Jurja Dobrile u Puli',
  'Sveučilište u Zagrebu',
  'Sveučilište u Rijeci',
  'Sveučilište u Splitu',
  'Sveučilište u Osijeku',
]

const cijeliBroj = (najvise) => Math.floor(Math.random() * najvise)

const izbor = (niz) => niz[cijeliBroj(niz.length)]

function datumPrije(dana) {
  const datum = new Date()
  datum.setDate(datum.getDate() + dana)
  return datum
}

const bezDijakritika = (tekst) =>
  tekst
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const zbirkaKorisnika = (korisnikId, naziv, baza = db) =>
  collection(baza, 'korisnici', korisnikId, naziv)

async function uSerijama(stavke, radnja, baza) {
  for (let pocetak = 0; pocetak < stavke.length; pocetak += VELICINA_SERIJE) {
    const serija = writeBatch(baza)
    stavke.slice(pocetak, pocetak + VELICINA_SERIJE).forEach((stavka) => radnja(serija, stavka))
    await serija.commit()
  }
}

const upisi = (zapisi, baza = db) =>
  uSerijama(zapisi, (serija, { zapis, podaci }) => serija.set(zapis, podaci), baza)

const izbrisi = (zapisi, baza = db) =>
  uSerijama(zapisi, (serija, zapis) => serija.delete(zapis), baza)

const emailIz = (ime) => `${bezDijakritika(ime).toLowerCase().replace(/\s+/g, '.')}@${DOMENA}`

const zadaciSvi = () => [
  ...izlogZadaci.map(({ zadatakId, ...zadatak }) => zadatak),
  ...DODATNI_ZADACI.map(({ pomak, ...zadatak }) => ({
    ...zadatak,
    rokIzvrsenja: isoDatum(datumPrije(pomak)),
  })),
]

function ciljDana(pomak, vikend, ciljMinuta) {
  if (pomak === 0) return Math.round(ciljMinuta * 0.97)
  if (pomak < NEDAVNIH_DANA) return Math.round(ciljMinuta * (0.7 + Math.random() * 0.35))
  return cijeliBroj(vikend ? 90 : 210)
}

function sesijeDana(dan, predmetIdevi, cilj) {
  const zapisi = []
  let minuta = 8 * 60 + cijeliBroj(60)
  let odradeno = 0
  while (odradeno < cilj && minuta < 22 * 60) {
    const trajanje = izbor(TRAJANJA)
    const pocetak = new Date(dan)
    pocetak.setMinutes(minuta)
    zapisi.push({
      predmetId: izbor(predmetIdevi),
      pocetak: pocetak.toISOString(),
      zavrsetak: new Date(pocetak.getTime() + trajanje * 60000).toISOString(),
      trajanje,
    })
    odradeno += trajanje
    minuta += trajanje + 5 + cijeliBroj(20)
  }
  return zapisi
}

function sesije(predmetIdevi, ciljMinuta) {
  const zapisi = []
  for (let pomak = TJEDANA * 7 - 1; pomak >= 0; pomak--) {
    const dan = datumPrije(-pomak)
    dan.setHours(0, 0, 0, 0)
    const vikend = dan.getDay() === 0 || dan.getDay() === 6
    zapisi.push(...sesijeDana(dan, predmetIdevi, ciljDana(pomak, vikend, ciljMinuta)))
  }
  return zapisi
}

function objave(korisnikId) {
  const zbirka = collection(db, 'sadrzajNaslovnice')
  return OBJAVE.map(({ pomak, dodatniGlasovi, ...objava }) => ({
    zapis: doc(zbirka),
    podaci: {
      ...objava,
      poveznica: '',
      datum: datumPrije(pomak).toISOString(),
      autorId: korisnikId,
      glasovi: { [korisnikId]: 1, ...dodatniGlasovi },
    },
  }))
}

function tekstualniPrilog(predmet, biljeske) {
  const redovi = [
    predmet.naziv.toUpperCase(),
    predmet.opis,
    '',
    ...biljeske.flatMap((biljeska) => [
      `[${biljeska.kategorija}] ${biljeska.naslov}`,
      biljeska.sadrzaj,
      '',
    ]),
  ]
  return new File([redovi.join('\n')], 'sazetak-predavanja.txt', { type: 'text/plain' })
}

function pdfPrilog(predmet) {
  const redovi = [
    bezDijakritika(predmet.naziv),
    'Popis literature',
    '',
    ...LITERATURA.map((stavka, indeks) => `${indeks + 1}. ${bezDijakritika(stavka)}`),
  ]
  const tok = redovi
    .map(
      (red, indeks) =>
        `BT /F1 ${indeks ? 12 : 20} Tf 60 ${780 - indeks * 26} Td (${red.replace(/[()\\]/g, '\\$&')}) Tj ET`,
    )
    .join('\n')

  const objekti = [
    '<</Type/Catalog/Pages 2 0 R>>',
    '<</Type/Pages/Kids[3 0 R]/Count 1>>',
    '<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>',
    `<</Length ${tok.length}>>\nstream\n${tok}\nendstream`,
    '<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>',
  ]

  let sadrzaj = '%PDF-1.4\n'
  const pomaci = []
  objekti.forEach((objekt, indeks) => {
    pomaci.push(sadrzaj.length)
    sadrzaj += `${indeks + 1} 0 obj\n${objekt}\nendobj\n`
  })

  const pocetakXref = sadrzaj.length
  sadrzaj += `xref\n0 ${objekti.length + 1}\n0000000000 65535 f \n`
  pomaci.forEach((pomak) => (sadrzaj += `${String(pomak).padStart(10, '0')} 00000 n \n`))
  sadrzaj += `trailer\n<</Size ${objekti.length + 1}/Root 1 0 R>>\nstartxref\n${pocetakXref}\n%%EOF`

  return new File([sadrzaj], 'popis-literature.pdf', { type: 'application/pdf' })
}

function slikovniPrilog(predmet) {
  const platno = document.createElement('canvas')
  platno.width = SIRINA_SLIKE
  platno.height = VISINA_SLIKE

  const crtac = platno.getContext('2d')
  crtac.fillStyle = bojaPredmeta(predmet.boja).hex
  crtac.fillRect(0, 0, SIRINA_SLIKE, VISINA_SLIKE)
  crtac.fillStyle = '#ffffff'
  crtac.textAlign = 'center'
  crtac.textBaseline = 'middle'
  crtac.font = 'bold 40px sans-serif'
  crtac.fillText(predmet.naziv, SIRINA_SLIKE / 2, VISINA_SLIKE / 2 - 16)
  crtac.font = '20px sans-serif'
  crtac.fillText(predmet.opis, SIRINA_SLIKE / 2, VISINA_SLIKE / 2 + 28)

  return new Promise((resolve) =>
    platno.toBlob((mrlja) => resolve(new File([mrlja], 'naslovna.png', { type: 'image/png' }))),
  )
}

async function posaljiPrilog(korisnikId, predmetId, datoteka, tip) {
  const putanja = `korisnici/${korisnikId}/predmeti/${predmetId}/${Date.now()}-${datoteka.name}`
  const mjesto = mjestoDatoteke(spremiste, putanja)
  await uploadBytes(mjesto, datoteka, {
    contentDisposition: `attachment; filename="${datoteka.name}"`,
  })
  return {
    naziv: datoteka.name,
    tip,
    velicinaKb: Math.round(datoteka.size / 1024),
    url: await getDownloadURL(mjesto),
    putanja,
    datum: isoDatum(),
  }
}

function korisnikIliGreska() {
  const auth = useAuthStore()
  if (!auth.korisnik) throw new Error('Prijavite se prije punjenja baze.')
  return auth
}

export async function zasij() {
  const auth = korisnikIliGreska()
  const korisnikId = auth.korisnik.korisnikId
  const jeAdmin = auth.jeAdmin
  const ciljMinuta = auth.korisnik.dnevniCiljSati * 60
  const zbirkaPredmeta = zbirkaKorisnika(korisnikId, 'predmeti')
  const zbirkaSesija = zbirkaKorisnika(korisnikId, 'pomodoroSesije')

  const idevi = {}
  const zapisi = []

  PREDMETI.forEach(({ predmetId, ...predmet }) => {
    const zapis = doc(zbirkaPredmeta)
    idevi[predmetId] = zapis.id
    zapisi.push({ zapis, podaci: predmet })
  })

  const podzbirka = (predmetId, naziv) => collection(doc(zbirkaPredmeta, idevi[predmetId]), naziv)

  zadaciSvi().forEach(({ predmetId, ...zadatak }) => {
    zapisi.push({ zapis: doc(podzbirka(predmetId, 'zadaci')), podaci: zadatak })
  })

  BILJESKE.forEach(({ predmetId, pomak, ...biljeska }) => {
    zapisi.push({
      zapis: doc(podzbirka(predmetId, 'biljeske')),
      podaci: { ...biljeska, datum: isoDatum(datumPrije(pomak)) },
    })
  })

  const generirane = sesije(Object.values(idevi), ciljMinuta)
  generirane.forEach((sesija) => zapisi.push({ zapis: doc(zbirkaSesija), podaci: sesija }))

  await upisi(zapisi)

  const objavljene = jeAdmin ? objave(korisnikId) : []
  if (objavljene.length) await upisi(objavljene)

  const priloziZapisi = []
  for (const predmet of PREDMETI) {
    const biljeske = BILJESKE.filter((biljeska) => biljeska.predmetId === predmet.predmetId)
    const datoteke = [
      { datoteka: tekstualniPrilog(predmet, biljeske), tip: 'dokument' },
      { datoteka: pdfPrilog(predmet), tip: 'pdf' },
      { datoteka: await slikovniPrilog(predmet), tip: 'slika' },
    ]
    const poslani = await Promise.all(
      datoteke.map(({ datoteka, tip }) =>
        posaljiPrilog(korisnikId, idevi[predmet.predmetId], datoteka, tip),
      ),
    )
    poslani.forEach((prilog) =>
      priloziZapisi.push({ zapis: doc(podzbirka(predmet.predmetId, 'prilozi')), podaci: prilog }),
    )
  }

  await upisi(priloziZapisi)

  return {
    predmeti: PREDMETI.length,
    zadaci: zadaciSvi().length,
    biljeske: BILJESKE.length,
    prilozi: priloziZapisi.length,
    sesije: generirane.length,
    sati: Math.round(generirane.reduce((zbroj, sesija) => zbroj + sesija.trajanje, 0) / 60),
    objave: objavljene.length,
  }
}

export async function pocisti() {
  const auth = korisnikIliGreska()
  const korisnikId = auth.korisnik.korisnikId

  const snimkaPredmeta = await getDocs(zbirkaKorisnika(korisnikId, 'predmeti'))
  const zapisi = []
  const putanje = []

  for (const predmet of snimkaPredmeta.docs) {
    for (const naziv of ['zadaci', 'biljeske', 'prilozi']) {
      const snimka = await getDocs(collection(predmet.ref, naziv))
      snimka.docs.forEach((dokument) => {
        if (dokument.data().putanja) putanje.push(dokument.data().putanja)
        zapisi.push(dokument.ref)
      })
    }
    zapisi.push(predmet.ref)
  }

  const snimkaSesija = await getDocs(zbirkaKorisnika(korisnikId, 'pomodoroSesije'))
  snimkaSesija.docs.forEach((dokument) => zapisi.push(dokument.ref))

  await Promise.all(
    putanje.map((putanja) => deleteObject(mjestoDatoteke(spremiste, putanja)).catch(() => {})),
  )
  await izbrisi(zapisi)

  return { predmeti: snimkaPredmeta.size, sesije: snimkaSesija.size, datoteke: putanje.length }
}

function sesijeKorisnika(predmetIdevi, dnevniProsjek) {
  const zapisi = []
  for (let pomak = TJEDANA_KORISNIKA * 7 - 1; pomak >= 0; pomak--) {
    const dan = datumPrije(-pomak)
    dan.setHours(0, 0, 0, 0)
    const vikend = dan.getDay() === 0 || dan.getDay() === 6
    const cilj = cijeliBroj(vikend ? dnevniProsjek : dnevniProsjek * 2)
    zapisi.push(...sesijeDana(dan, predmetIdevi, cilj))
  }
  return zapisi
}

function profilKorisnika(ime, indeks) {
  const nedavno = indeks < 8
  return {
    ...PREDLOZAK,
    email: emailIz(ime),
    ime,
    sveuciliste: izbor(SVEUCILISTA),
    godina: 1 + cijeliBroj(5),
    dnevniCiljSati: 3 + cijeliBroj(5),
    datumRegistracije: isoDatum(datumPrije(nedavno ? -cijeliBroj(7) : -(7 + cijeliBroj(53)))),
    zadnjaPrijava: datumPrije(indeks < 6 ? 0 : -cijeliBroj(30)).toISOString(),
  }
}

async function zasijPodatkeKorisnika(korisnikId, baza) {
  const zbirkaPredmeta = zbirkaKorisnika(korisnikId, 'predmeti', baza)
  const zbirkaSesija = zbirkaKorisnika(korisnikId, 'pomodoroSesije', baza)

  const odabrani = [...PREDMETI].sort(() => Math.random() - 0.5).slice(0, 2 + cijeliBroj(2))
  const idevi = {}
  const zapisi = []

  odabrani.forEach(({ predmetId, ...predmet }) => {
    const zapis = doc(zbirkaPredmeta)
    idevi[predmetId] = zapis.id
    zapisi.push({ zapis, podaci: predmet })
  })

  const podzbirka = (predmetId, naziv) => collection(doc(zbirkaPredmeta, idevi[predmetId]), naziv)

  zadaciSvi()
    .filter(({ predmetId }) => idevi[predmetId])
    .forEach(({ predmetId, ...zadatak }) => {
      zapisi.push({ zapis: doc(podzbirka(predmetId, 'zadaci')), podaci: zadatak })
    })

  BILJESKE.filter(({ predmetId }) => idevi[predmetId]).forEach(
    ({ predmetId, pomak, ...biljeska }) => {
      zapisi.push({
        zapis: doc(podzbirka(predmetId, 'biljeske')),
        podaci: { ...biljeska, datum: isoDatum(datumPrije(pomak)) },
      })
    },
  )

  const generirane = sesijeKorisnika(Object.values(idevi), 45 + cijeliBroj(70))
  generirane.forEach((sesija) => zapisi.push({ zapis: doc(zbirkaSesija), podaci: sesija }))

  await upisi(zapisi, baza)

  return { predmeti: odabrani.length, sesije: generirane.length }
}

export async function zasijKorisnike(broj = 20) {
  const auth = korisnikIliGreska()
  if (!auth.jeAdmin) throw new Error('Za lažne korisnike potrebna je administratorska uloga.')

  const aplikacija = initializeApp(konfiguracija, `sjeme-${Date.now()}`)
  const drugiAuth = getAuth(aplikacija)
  const drugaBaza = getFirestore(aplikacija)

  const stvoreni = []
  const preskoceni = []

  try {
    for (const [indeks, ime] of IMENA.slice(0, broj).entries()) {
      try {
        const { user } = await createUserWithEmailAndPassword(drugiAuth, emailIz(ime), lozinka())
        await upisi(
          [{ zapis: doc(drugaBaza, 'korisnici', user.uid), podaci: profilKorisnika(ime, indeks) }],
          drugaBaza,
        )
        const brojke = await zasijPodatkeKorisnika(user.uid, drugaBaza)
        stvoreni.push({ korisnikId: user.uid, ime, ...brojke })
      } catch (iznimka) {
        preskoceni.push(`${ime}: ${iznimka.code ?? iznimka.message}`)
      } finally {
        await signOut(drugiAuth)
      }
    }
  } finally {
    await deleteApp(aplikacija)
  }

  for (const [indeks, korisnik] of stvoreni.entries()) {
    const promjene = {}
    if (indeks < ADMINA) promjene.uloga = 'admin'
    if (indeks >= stvoreni.length - DEAKTIVIRANIH) promjene.aktivan = false
    if (Object.keys(promjene).length) {
      await updateDoc(doc(db, 'korisnici', korisnik.korisnikId), promjene)
    }
  }

  return {
    korisnici: stvoreni.length,
    administratori: Math.min(ADMINA, stvoreni.length),
    deaktivirani: Math.min(DEAKTIVIRANIH, stvoreni.length),
    predmeti: stvoreni.reduce((zbroj, korisnik) => zbroj + korisnik.predmeti, 0),
    sesije: stvoreni.reduce((zbroj, korisnik) => zbroj + korisnik.sesije, 0),
    preskoceni,
  }
}

export async function pocistiKorisnike() {
  const auth = korisnikIliGreska()
  if (!auth.jeAdmin)
    throw new Error('Za brisanje lažnih korisnika potrebna je administratorska uloga.')

  const snimka = await getDocs(collection(db, 'korisnici'))
  const lazni = snimka.docs.filter((dokument) => dokument.data().email?.endsWith(`@${DOMENA}`))
  const zapisi = []

  for (const korisnik of lazni) {
    const snimkaPredmeta = await getDocs(collection(korisnik.ref, 'predmeti'))
    for (const predmet of snimkaPredmeta.docs) {
      for (const naziv of ['zadaci', 'biljeske', 'prilozi']) {
        const podzbirka = await getDocs(collection(predmet.ref, naziv))
        podzbirka.docs.forEach((dokument) => zapisi.push(dokument.ref))
      }
      zapisi.push(predmet.ref)
    }
    const snimkaSesija = await getDocs(collection(korisnik.ref, 'pomodoroSesije'))
    snimkaSesija.docs.forEach((dokument) => zapisi.push(dokument.ref))
    zapisi.push(korisnik.ref)
  }

  await izbrisi(zapisi)

  return { korisnici: lazni.length, dokumenti: zapisi.length }
}
