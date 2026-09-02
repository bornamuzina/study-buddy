<script setup>
import { computed, ref, watch } from 'vue'
import BaseSelect from '../../components/ui/BaseSelect.vue'
import Icon from '../../components/ui/Icon.vue'
import IconButton from '../../components/ui/IconButton.vue'
import Loader from '../../components/ui/Loader.vue'
import PageHeading from '../../components/ui/PageHeading.vue'
import UserRow from '../../components/UserRow.vue'
import ConfirmModal from '../../components/modals/ConfirmModal.vue'
import { useConfirm } from '../../composables/useConfirm'
import { useGreske } from '../../composables/greske'
import { usePagination } from '../../composables/pagination'
import { useAdminStore } from '../../stores/admin'
import { useAuthStore } from '../../stores/auth'
import { sBrojem } from '../../utils/format'

const admin = useAdminStore()
const auth = useAuthStore()
const { upit: potvrdaUpit, pitaj, odgovori } = useConfirm()
const { pokusaj } = useGreske()

const PO_STRANICI = 8

const upit = ref('')
const filterUloge = ref('sve')
const filterStatusa = ref('svi')
const odabrani = ref([])

const ulogaOpcije = [
  { value: 'sve', label: 'Sve uloge' },
  { value: 'student', label: 'Student' },
  { value: 'admin', label: 'Administrator' },
]

const statusOpcije = [
  { value: 'svi', label: 'Svi statusi' },
  { value: 'aktivan', label: 'Aktivan' },
  { value: 'neaktivan', label: 'Deaktiviran' },
]

const filtrirani = computed(() =>
  admin.korisnici.filter((korisnik) => {
    const tekst = `${korisnik.ime} ${korisnik.email}`.toLowerCase()
    const odgovaraUpitu = tekst.includes(upit.value.toLowerCase().trim())
    const odgovaraUlozi = filterUloge.value === 'sve' || korisnik.uloga === filterUloge.value
    const odgovaraStatusu =
      filterStatusa.value === 'svi' || (filterStatusa.value === 'aktivan') === korisnik.aktivan
    return odgovaraUpitu && odgovaraUlozi && odgovaraStatusu
  }),
)

const {
  stranica,
  brojStranica,
  stranicaStavki: stranicaKorisnika,
} = usePagination(filtrirani, PO_STRANICI)

const mojId = computed(() => auth.korisnik.korisnikId)

const oznacivi = computed(() =>
  stranicaKorisnika.value.filter((korisnik) => korisnik.korisnikId !== mojId.value),
)

const sviOdabrani = computed(
  () =>
    oznacivi.value.length > 0 &&
    oznacivi.value.every((korisnik) => odabrani.value.includes(korisnik.korisnikId)),
)

watch([upit, filterUloge, filterStatusa], () => {
  stranica.value = 1
})

function prebaciOdabir(korisnikId) {
  odabrani.value = odabrani.value.includes(korisnikId)
    ? odabrani.value.filter((id) => id !== korisnikId)
    : [...odabrani.value, korisnikId]
}

function prebaciSve() {
  const idevi = oznacivi.value.map((korisnik) => korisnik.korisnikId)
  odabrani.value = sviOdabrani.value
    ? odabrani.value.filter((id) => !idevi.includes(id))
    : [...new Set([...odabrani.value, ...idevi])]
}

async function skupnaDeaktivacija() {
  const potvrda = await pitaj({
    naslov: 'Skupna deaktivacija',
    tekst: `Deaktivirati ${odabrani.value.length} korisnika? Neće se moći prijaviti dok ih ponovno ne aktivirate.`,
    gumb: 'Deaktiviraj',
  })
  if (!potvrda) return
  if (!(await pokusaj(() => admin.skupnaDeaktivacija(odabrani.value)))) return
  odabrani.value = []
}

async function prebaciAktivnost(korisnik) {
  const aktivan = !korisnik.aktivan
  const potvrda = await pitaj({
    naslov: aktivan ? 'Aktivacija računa' : 'Deaktivacija računa',
    tekst: aktivan
      ? `Vratiti pristup korisniku ${korisnik.ime}?`
      : `Deaktivirati korisnika ${korisnik.ime}? Neće se moći prijaviti dok ga ponovno ne aktivirate.`,
    gumb: aktivan ? 'Aktiviraj' : 'Deaktiviraj',
    opasno: !aktivan,
  })
  if (!potvrda) return
  pokusaj(() => admin.postaviAktivnost(korisnik.korisnikId, aktivan))
}

async function skupnoBrisanje() {
  const potvrda = await pitaj({
    naslov: 'Skupno brisanje',
    tekst: `Trajno obrisati ${odabrani.value.length} korisnika?`,
    gumb: 'Obriši',
  })
  if (!potvrda) return
  if (!(await pokusaj(() => admin.skupnoBrisanje(odabrani.value)))) return
  odabrani.value = []
}

async function prebaciUlogu(korisnik) {
  const nova = korisnik.uloga === 'admin' ? 'student' : 'admin'
  const opis = nova === 'admin' ? 'administratora' : 'studenta'
  const potvrda = await pitaj({
    naslov: 'Promjena uloge',
    tekst: `Postaviti korisnika ${korisnik.ime} kao ${opis}?`,
    gumb: 'Postavi',
    opasno: false,
  })
  if (!potvrda) return
  pokusaj(() => admin.postaviUlogu(korisnik.korisnikId, nova))
}

async function obrisi(korisnik) {
  const potvrda = await pitaj({
    naslov: 'Brisanje korisnika',
    tekst: `Trajno obrisati korisnika ${korisnik.ime}?`,
    gumb: 'Obriši',
  })
  if (!potvrda) return
  if (!(await pokusaj(() => admin.obrisiKorisnika(korisnik.korisnikId)))) return
  odabrani.value = odabrani.value.filter((id) => id !== korisnik.korisnikId)
}
</script>

<template>
  <div>
    <PageHeading
      title="Upravljanje korisnicima"
      subtitle="Pregled i uređivanje registriranih korisnika."
    />

    <div class="flex flex-wrap gap-4">
      <label class="relative w-full flex-1 sm:w-auto sm:min-w-72">
        <Icon
          name="pretraga"
          size="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
        />
        <input
          v-model="upit"
          type="search"
          placeholder="Pretraži po imenu ili e-pošti..."
          class="w-full rounded-xl bg-slate-200/70 py-3 pr-4 pl-12 text-slate-800 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-sb-indigo"
        />
      </label>
      <BaseSelect v-model="filterUloge" :options="ulogaOpcije" />
      <BaseSelect v-model="filterStatusa" :options="statusOpcije" />
    </div>

    <div
      v-if="odabrani.length"
      class="mt-6 flex flex-wrap items-center gap-4 rounded-xl bg-indigo-50 px-5 py-3"
    >
      <p class="text-sm font-semibold text-sb-blue">
        {{
          sBrojem(odabrani.length, 'korisnik odabran', 'korisnika odabrana', 'korisnika odabrano')
        }}
      </p>
      <span class="h-5 w-px bg-indigo-200" />
      <button
        class="flex cursor-pointer items-center gap-2 text-sm text-slate-600 transition hover:text-sb-blue"
        @click="skupnaDeaktivacija"
      >
        <Icon name="zabrana" size="h-4 w-4" />
        Skupna deaktivacija
      </button>
      <button
        class="flex cursor-pointer items-center gap-2 text-sm text-slate-600 transition hover:text-red-600"
        @click="skupnoBrisanje"
      >
        <Icon name="kanta" size="h-4 w-4" />
        Skupno brisanje
      </button>
    </div>

    <Loader v-if="admin.ucitavanje" />

    <div v-else class="rounded-card mt-6 overflow-hidden bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full min-w-3xl text-left">
          <thead class="bg-slate-100 text-[10px] tracking-wide text-slate-500 uppercase">
            <tr>
              <th class="w-12 px-6 py-4">
                <input
                  type="checkbox"
                  :checked="sviOdabrani"
                  class="h-4 w-4 cursor-pointer"
                  @change="prebaciSve"
                />
              </th>
              <th class="px-6 py-4">Ime</th>
              <th class="px-6 py-4">Uloga</th>
              <th class="px-6 py-4">Datum pridruživanja</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4 text-right">Radnje</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <UserRow
              v-for="korisnik in stranicaKorisnika"
              :key="korisnik.korisnikId"
              :korisnik="korisnik"
              :moj="korisnik.korisnikId === mojId"
              :odabran="odabrani.includes(korisnik.korisnikId)"
              @oznaci="prebaciOdabir(korisnik.korisnikId)"
              @uloga="prebaciUlogu(korisnik)"
              @aktivnost="prebaciAktivnost(korisnik)"
              @obrisi="obrisi(korisnik)"
            />

            <tr v-if="!stranicaKorisnika.length">
              <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-500">
                Nema korisnika koji odgovaraju filterima.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-4 py-4 sm:px-6"
      >
        <p class="text-sm text-slate-500">
          Prikaz {{ stranicaKorisnika.length }} od {{ filtrirani.length }} korisnika
        </p>

        <div class="flex items-center gap-1">
          <IconButton
            name="lijevo"
            :disabled="stranica === 1"
            title="Prethodna stranica"
            @click="stranica--"
          />

          <button
            v-for="broj in brojStranica"
            :key="broj"
            class="h-9 w-9 cursor-pointer rounded-lg text-sm font-medium transition"
            :class="
              broj === stranica ? 'bg-sb-indigo text-sb-light' : 'text-slate-500 hover:bg-slate-100'
            "
            @click="stranica = broj"
          >
            {{ broj }}
          </button>

          <IconButton
            name="desno"
            :disabled="stranica === brojStranica"
            title="Sljedeća stranica"
            @click="stranica++"
          />
        </div>
      </div>
    </div>
    <ConfirmModal :upit="potvrdaUpit" @odgovor="odgovori" />
  </div>
</template>
