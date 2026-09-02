<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseCard from '../components/ui/BaseCard.vue'
import MicroLabel from '../components/ui/MicroLabel.vue'
import PageHeading from '../components/ui/PageHeading.vue'

const POVEZNICE = [
  { naziv: 'Fakultet informatike u Puli', url: 'https://fipu.unipu.hr' },
  { naziv: 'Kolegij Programsko inženjerstvo', url: 'https://ntankovic.unipu.hr/pi' },
  { naziv: 'doc. dr. sc. Nikola Tanković', url: 'https://ntankovic.unipu.hr' },
]

const STRANICE = {
  'o-nama': {
    naslov: 'O nama',
    podnaslov: 'Studentski projekt s Fakulteta informatike u Puli.',
    odlomci: [
      {
        naslov: 'Zašto aplikacija postoji',
        tekst:
          'Student tijekom semestra prati više kolegija odjednom, a rokovi, bilješke i materijali obično završe razbacani po bilježnicama, mailovima i chatovima. StudyBuddy ih drži na jednom mjestu i mjeri koliko je vremena stvarno potrošeno na učenje, umjesto da se student oslanja na dojam.',
      },
      {
        naslov: 'Tko stoji iza nje',
        tekst:
          'Aplikaciju je izradio Marko Kovač kao samostalan rad na kolegiju Programsko inženjerstvo, pod mentorstvom doc. dr. sc. Nikole Tankovića.',
      },
      {
        naslov: 'Kako je nastala',
        tekst:
          'Sučelje je najprije prototipirano u Figmi, zatim napisano u Vue 3 s Pinijom i Tailwindom. Podaci žive na Firebaseu: Authentication za prijavu, Firestore za zapise i Storage za priložene datoteke.',
      },
    ],
    poveznice: POVEZNICE,
  },
  kontakt: {
    naslov: 'Kontakt',
    podnaslov: 'Pitanja o aplikaciji idu preko kolegija na kojem nastaje.',
    odlomci: [
      {
        naslov: 'Autor',
        tekst: 'Marko Kovač, student Fakulteta informatike u Puli.',
      },
      {
        naslov: 'Vrijeme odgovora',
        tekst: 'Aplikacija nema dežurnu podršku.',
      },
    ],
    poveznice: POVEZNICE,
  },
  privatnost: {
    naslov: 'Privatnost',
    podnaslov: 'Koje podatke aplikacija sprema, gdje ih drži i tko ih vidi.',
    odlomci: [
      {
        naslov: 'Što se sprema',
        tekst:
          'Adresa e-pošte i podaci profila koje sami unesete (ime, sveučilište, godina studija, dnevni cilj), zatim vaši predmeti, zadaci, bilješke, priložene datoteke i Pomodoro sesije. Uz račun se bilježi i vrijeme zadnje prijave.',
      },
      {
        naslov: 'Gdje se sprema',
        tekst:
          'Sve je na Google Firebaseu. Prijavu vodi Firebase Authentication, zapisi su u Firestoreu, a datoteke na Storageu. Lozinku aplikacija ne vidi niti je sprema.',
      },
      {
        naslov: 'Tko ih vidi',
        tekst:
          'Vaše zapise vidite vi. Sigurnosna pravila Firestorea odbijaju svaki pokušaj čitanja tuđih podataka, i to na poslužitelju, ne u pregledniku. Administrator platforme ima pristup računima i zapisima jer održava aplikaciju.',
      },
      {
        naslov: 'Praćenje',
        tekst:
          'Nema analitike ni oglašivačkih kolačića. Podatak o prijavi čuva se u pregledniku kako biste ostali prijavljeni između posjeta.',
      },
      {
        naslov: 'Vaša kontrola',
        tekst:
          'Predmete, zadatke, bilješke i priloge brišete sami; brisanjem predmeta nestaju i njegove datoteke sa Storagea. Račun možete deaktivirati u profilu, čime gubite pristup dok ga administrator ponovno ne aktivira. Deaktivacija ne briše zapise.',
      },
    ],
  },
  uvjeti: {
    naslov: 'Uvjeti korištenja',
    podnaslov: 'Pravila koja vrijede dok koristite aplikaciju.',
    odlomci: [
      {
        naslov: 'Namjena',
        tekst:
          'StudyBuddy je studentski projekt izrađen u sklopu kolegija. Namijenjen je organizaciji vlastitog učenja.',
      },
      {
        naslov: 'Račun',
        tekst:
          'Za svoj račun i lozinku odgovarate sami. Jedan račun pripada jednoj osobi i ne dijeli se.',
      },
      {
        naslov: 'Sadržaj koji unosite',
        tekst:
          'Za bilješke i priloge koje unesete odgovarate vi. Nemojte slati materijale na koje nemate pravo niti sadržaj koji vrijeđa druge.',
      },
      {
        naslov: 'Prestanak korištenja',
        tekst:
          'Račun deaktivirate u profilu kad god želite. Administrator može deaktivirati ili obrisati račun koji krši ova pravila.',
      },
    ],
  },
}

const route = useRoute()

const stranica = computed(() => STRANICE[route.name])
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
    <PageHeading :title="stranica.naslov" :subtitle="stranica.podnaslov" />

    <div class="space-y-4">
      <BaseCard v-for="odlomak in stranica.odlomci" :key="odlomak.naslov">
        <p class="font-bold text-slate-900">{{ odlomak.naslov }}</p>
        <p class="mt-1 text-sm leading-relaxed text-slate-600">{{ odlomak.tekst }}</p>
      </BaseCard>
    </div>

    <BaseCard v-if="stranica.poveznice" class="mt-6">
      <MicroLabel class="mb-3">Korisne poveznice</MicroLabel>
      <div class="flex flex-col gap-2">
        <a
          v-for="poveznica in stranica.poveznice"
          :key="poveznica.url"
          :href="poveznica.url"
          target="_blank"
          rel="noreferrer"
          class="text-sm font-semibold text-sb-indigo transition hover:underline"
        >
          {{ poveznica.naziv }}
        </a>
      </div>
    </BaseCard>
  </div>
</template>
