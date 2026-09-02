<script setup>
import { computed, ref, watch } from 'vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseSelect from '../components/ui/BaseSelect.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import ProgressBar from '../components/ui/ProgressBar.vue'
import Icon from '../components/ui/Icon.vue'
import IconTile from '../components/ui/IconTile.vue'
import PageHeading from '../components/ui/PageHeading.vue'
import SectionPanel from '../components/ui/SectionPanel.vue'
import Loader from '../components/ui/Loader.vue'
import SubjectCard from '../components/SubjectCard.vue'
import TaskRow from '../components/TaskRow.vue'
import NoteCard from '../components/NoteCard.vue'
import FileRow from '../components/FileRow.vue'
import SubjectModal from '../components/modals/SubjectModal.vue'
import TaskModal from '../components/modals/TaskModal.vue'
import NoteModal from '../components/modals/NoteModal.vue'
import ConfirmModal from '../components/modals/ConfirmModal.vue'
import { useConfirm } from '../composables/useConfirm'
import { useEditing } from '../composables/editing'
import { useGreske } from '../composables/greske'
import TimerCard from '../components/TimerCard.vue'
import { useSubjectsStore } from '../stores/subjects'
import { KVOTA_KB, PRIORITETI, STATUSI } from '../data/constants'
import { bojaPredmeta, decimalni, formatVelicina, prioritetNaziv } from '../utils/format'

const store = useSubjectsStore()
const { upit, pitaj, odgovori } = useConfirm()
const { pokusaj } = useGreske()

const odabraniId = ref(null)

watch(
  () => store.predmeti,
  (predmeti) => {
    if (!predmeti.some((predmet) => predmet.predmetId === odabraniId.value))
      odabraniId.value = predmeti[0]?.predmetId ?? null
  },
  { immediate: true },
)

const filterPrioriteta = ref('svi')
const filterKategorije = ref('sve')
const prikaziSveBiljeske = ref(false)

watch(odabraniId, () => {
  filterKategorije.value = 'sve'
  prikaziSveBiljeske.value = false
})

const predmetModal = useEditing(store.dodajPredmet, store.urediPredmet, 'predmetId')

const zadatakModal = useEditing(
  (podaci) => store.dodajZadatak({ ...podaci, predmetId: odabraniId.value }),
  store.urediZadatak,
  'zadatakId',
)

const biljeskaModal = useEditing(
  (podaci) => store.dodajBiljesku({ ...podaci, predmetId: odabraniId.value }),
  store.urediBiljesku,
  'biljeskaId',
)

const odabrani = computed(() => store.predmetPoId(odabraniId.value))

const prioritetOpcije = [
  { value: 'svi', label: 'Prioritet: svi' },
  ...Object.values(PRIORITETI).map((prioritet) => ({
    value: prioritet,
    label: prioritetNaziv[prioritet],
  })),
]

const zadaciOdabranog = computed(() => {
  const svi = store.zadaciPredmeta(odabraniId.value)
  const filtrirani =
    filterPrioriteta.value === 'svi'
      ? svi
      : svi.filter((zadatak) => zadatak.prioritet === filterPrioriteta.value)
  return [...filtrirani].sort(
    (prvi, drugi) => (prvi.status === STATUSI.ZAVRSENO) - (drugi.status === STATUSI.ZAVRSENO),
  )
})

const kategorijeOdabranog = computed(() => store.kategorijePredmeta(odabraniId.value))

const kategorijaOpcije = computed(() => [
  { value: 'sve', label: 'Sve' },
  ...kategorijeOdabranog.value.map((kategorija) => ({ value: kategorija, label: kategorija })),
])

const filtriraneBiljeske = computed(() => {
  const sve = store.biljeskePredmeta(odabraniId.value)
  return filterKategorije.value === 'sve'
    ? sve
    : sve.filter((biljeska) => biljeska.kategorija === filterKategorije.value)
})

const biljeskeOdabranog = computed(() =>
  prikaziSveBiljeske.value ? filtriraneBiljeske.value : filtriraneBiljeske.value.slice(0, 2),
)

const priloziOdabranog = computed(() => store.priloziPredmeta(odabraniId.value))

const iskoristenoKb = computed(() =>
  store.prilozi.reduce((zbroj, prilog) => zbroj + prilog.velicinaKb, 0),
)
const iskoristenoPostotak = computed(() =>
  Math.min(Math.round((iskoristenoKb.value / KVOTA_KB) * 1000) / 10, 100),
)

async function obrisiPredmet() {
  const potvrda = await pitaj({
    naslov: 'Brisanje predmeta',
    tekst: `Obrisati predmet "${odabrani.value.naziv}" sa svim zadacima, bilješkama i prilozima?`,
    gumb: 'Obriši',
  })
  if (!potvrda) return
  pokusaj(() => store.obrisiPredmet(odabraniId.value))
}

function ucitajDatoteku(dogadaj) {
  const datoteka = dogadaj.target.files[0]
  if (!datoteka) return
  pokusaj(() => store.dodajPrilog({ predmetId: odabraniId.value, datoteka }))
  dogadaj.target.value = ''
}
</script>

<template>
  <div>
    <div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-6">
      <PageHeading
        spacing=""
        title="Upravljanje predmetima"
        subtitle="Svi kolegiji, zadaci, bilješke i materijali na jednom mjestu."
      />
      <BaseButton @click="predmetModal.otvoriNovu()">
        <Icon name="plus" size="h-4 w-4" />
        Dodaj novi predmet
      </BaseButton>
    </div>

    <BaseCard v-if="store.ucitavanje">
      <Loader tekst="Učitavanje predmeta" />
    </BaseCard>
    <div
      v-else-if="store.predmeti.length"
      class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      <SubjectCard
        v-for="predmet in store.predmeti"
        :key="predmet.predmetId"
        :predmet="predmet"
        :na-cekanju="store.naCekanju(predmet.predmetId)"
        :napredak="store.napredak(predmet.predmetId)"
        :aktivan="predmet.predmetId === odabraniId"
        @click="odabraniId = predmet.predmetId"
      />
    </div>
    <BaseCard v-else>
      <p class="text-slate-500">Još nemate predmeta. Dodajte prvi i krenite s organizacijom.</p>
    </BaseCard>

    <template v-if="odabrani">
      <div class="mt-12 flex flex-wrap items-center justify-between gap-4">
        <div class="flex min-w-0 items-center gap-4">
          <IconTile
            :name="odabrani.ikona"
            size="h-12 w-12"
            icon-size="h-6 w-6"
            :class="[bojaPredmeta(odabrani.boja).pozadina, bojaPredmeta(odabrani.boja).tekst]"
          />
          <h2 class="min-w-0 text-2xl font-bold wrap-break-word text-slate-900 sm:text-3xl">
            {{ odabrani.naziv }}
          </h2>
        </div>

        <div class="flex items-center gap-3">
          <BaseButton variant="ghost" @click="predmetModal.otvoriUredi(odabrani)">
            Uredi predmet
          </BaseButton>
          <BaseButton variant="ghost" class="text-red-600 hover:bg-red-50" @click="obrisiPredmet"
            >Obriši</BaseButton
          >
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div class="space-y-6 xl:col-span-2">
          <SectionPanel title="Aktivni zadaci" icon="kvacica">
            <template #akcije>
              <BaseSelect v-model="filterPrioriteta" :options="prioritetOpcije" />
              <BaseButton @click="zadatakModal.otvoriNovu()">
                <Icon name="plus" size="h-4 w-4" />
                Dodaj zadatak
              </BaseButton>
            </template>

            <div v-if="zadaciOdabranog.length" class="space-y-3">
              <TaskRow
                v-for="zadatak in zadaciOdabranog"
                :key="zadatak.zadatakId"
                :zadatak="zadatak"
                @prebaci="pokusaj(() => store.prebaciStatus(zadatak.zadatakId))"
                @uredi="zadatakModal.otvoriUredi(zadatak)"
                @obrisi="pokusaj(() => store.obrisiZadatak(zadatak.zadatakId))"
              />
            </div>
            <p v-else class="text-sm text-slate-500">Nema zadataka za odabrani filter.</p>
          </SectionPanel>

          <SectionPanel title="Bilješke" icon="dokument">
            <template #akcije>
              <BaseSelect
                v-if="kategorijeOdabranog.length"
                v-model="filterKategorije"
                :options="kategorijaOpcije"
              />
              <button
                v-if="filtriraneBiljeske.length > 2"
                class="cursor-pointer text-sm font-semibold text-sb-indigo"
                @click="prikaziSveBiljeske = !prikaziSveBiljeske"
              >
                {{ prikaziSveBiljeske ? 'Prikaži manje' : 'Prikaži sve bilješke' }}
              </button>
              <BaseButton @click="biljeskaModal.otvoriNovu()">
                <Icon name="plus" size="h-4 w-4" />
                Nova bilješka
              </BaseButton>
            </template>

            <div v-if="biljeskeOdabranog.length" class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <NoteCard
                v-for="biljeska in biljeskeOdabranog"
                :key="biljeska.biljeskaId"
                :biljeska="biljeska"
                @uredi="biljeskaModal.otvoriUredi(biljeska)"
                @obrisi="pokusaj(() => store.obrisiBiljesku(biljeska.biljeskaId))"
              />
            </div>
            <p v-else class="text-sm text-slate-500">
              {{
                filterKategorije === 'sve'
                  ? 'Još nema bilježaka za ovaj predmet.'
                  : 'Nema bilježaka u odabranoj kategoriji.'
              }}
            </p>
          </SectionPanel>
        </div>

        <div class="space-y-6">
          <TimerCard :predmet-id="odabraniId" />

          <SectionPanel title="Resursi" icon="mapa">
            <template #akcije>
              <label
                class="cursor-pointer rounded-xl bg-white p-2.5 text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                <Icon name="upload" />
                <input type="file" class="hidden" @change="ucitajDatoteku" />
              </label>
            </template>

            <Loader v-if="store.slanjePriloga" tekst="Slanje datoteke" />
            <div v-else-if="priloziOdabranog.length" class="space-y-3">
              <FileRow
                v-for="prilog in priloziOdabranog"
                :key="prilog.prilogId"
                :prilog="prilog"
                @obrisi="pokusaj(() => store.obrisiPrilog(prilog.prilogId))"
              />
            </div>
            <p v-else class="text-sm text-slate-500">Nema priloga. Dodajte datoteku ili sliku.</p>

            <div class="mt-6 border-t border-slate-200 pt-4">
              <p class="mb-2 text-center text-xs text-slate-500">
                Iskoristili ste {{ decimalni(iskoristenoPostotak) }}% od
                {{ formatVelicina(KVOTA_KB) }} prostora
              </p>
              <ProgressBar :value="iskoristenoPostotak" />
            </div>
          </SectionPanel>
        </div>
      </div>
    </template>

    <SubjectModal
      v-model="predmetModal.otvoren"
      :predmet="predmetModal.stavka"
      @spremi="predmetModal.spremi"
    />
    <TaskModal
      v-model="zadatakModal.otvoren"
      :zadatak="zadatakModal.stavka"
      @spremi="zadatakModal.spremi"
    />
    <NoteModal
      v-model="biljeskaModal.otvoren"
      :biljeska="biljeskaModal.stavka"
      :kategorije="kategorijeOdabranog"
      @spremi="biljeskaModal.spremi"
    />
    <ConfirmModal :upit="upit" @odgovor="odgovori" />
  </div>
</template>
