<script setup>
import BaseCard from '../components/ui/BaseCard.vue'
import IconTile from '../components/ui/IconTile.vue'
import PageHeading from '../components/ui/PageHeading.vue'

const teme = [
  {
    ikona: 'knjiga',
    naslov: 'Predmeti, zadaci i bilješke',
    opis: 'Predmet je polazna točka - zadaci, bilješke i prilozi vise o njemu. Postotak na kartici predmeta je omjer dovršenih i ukupnih zadataka. Brisanje predmeta briše i sve što je pod njim, zato traži potvrdu.',
  },
  {
    ikona: 'sat',
    naslov: 'Pomodoro timer',
    opis: 'Timer se pokreće za odabrani predmet i nastavlja raditi dok se krećete kroz aplikaciju. Trajanje sesije, trajanje pauze i automatski nastavak mijenjaju se u profilu. Svaka dovršena sesija se sprema i ulazi u statistiku.',
  },
  {
    ikona: 'graf',
    naslov: 'Statistika',
    opis: 'Grafovi se računaju isključivo iz spremljenih Pomodoro sesija, ručni unos vremena ne postoji. Filteri predmeta i razdoblja mijenjaju sva tri grafa istovremeno.',
  },
  {
    ikona: 'mapa',
    naslov: 'Prilozi',
    opis: 'Datoteke se šalju na Firebase Storage i vežu uz predmet. Traka prostora pokazuje zauzeće unutar kvote. Brisanje priloga ili cijelog predmeta uklanja i datoteku.',
  },
  {
    ikona: 'zvono',
    naslov: 'Obavijesti',
    opis: 'Zvono u zaglavlju skuplja zadatke kojima rok istječe, stanje dnevnog cilja i nove objave u Novostima. Što se prikazuje ovisi o prekidačima na stranici Postavke.',
  },
  {
    ikona: 'iskra',
    naslov: 'Novosti',
    opis: 'Objave administratora možete ocijeniti glasom gore ili dolje, jedan glas po korisniku. Ponovni klik na isti smjer uklanja glas. Poredak prati zbroj glasova, pa datum.',
  },
  {
    ikona: 'stit',
    naslov: 'Račun i privatnost',
    opis: 'Vaši predmeti, zadaci, bilješke i sesije vidljivi su samo vama. Deaktivacija računa u profilu prekida pristup dok ga administrator ponovno ne aktivira.',
  },
]
</script>

<template>
  <div>
    <PageHeading
      title="Pomoć"
      subtitle="Kratki pregled kako pojedini dio aplikacije radi i odakle dolaze brojevi."
    />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <BaseCard v-for="tema in teme" :key="tema.naslov">
        <div class="flex gap-4">
          <IconTile :name="tema.ikona" class="bg-indigo-100 text-sb-indigo" />
          <div>
            <p class="font-bold text-slate-900">{{ tema.naslov }}</p>
            <p class="mt-1 text-sm text-slate-600">{{ tema.opis }}</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <BaseCard class="mt-6">
      <p class="font-bold text-slate-900">Nešto ne radi kako piše?</p>
      <p class="mt-1 text-sm text-slate-600">
        Provjerite jeste li prijavljeni ispravnim računom i osvježite stranicu. Ako i dalje ne
        valja, javite se administratoru platforme.
      </p>
    </BaseCard>
  </div>
</template>
