<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import Avatar from '../components/ui/Avatar.vue'
import FieldLabel from '../components/ui/FieldLabel.vue'
import Icon from '../components/ui/Icon.vue'
import MicroLabel from '../components/ui/MicroLabel.vue'
import PageHeading from '../components/ui/PageHeading.vue'
import SaveBar from '../components/SaveBar.vue'
import ConfirmModal from '../components/modals/ConfirmModal.vue'
import PasswordModal from '../components/modals/PasswordModal.vue'
import { useConfirm } from '../composables/useConfirm'
import { useGreske } from '../composables/greske'
import { useLogout } from '../composables/logout'
import { useProfileForm } from '../composables/profileForm'
import { useAuthStore } from '../stores/auth'
import { porukaGreske } from '../utils/errors'

const auth = useAuthStore()
const router = useRouter()
const odjava = useLogout()
const { upit, pitaj, odgovori } = useConfirm()
const { pokusaj } = useGreske()

const pocetno = () => ({
  ime: auth.korisnik.ime,
  sveuciliste: auth.korisnik.sveuciliste,
  godina: auth.korisnik.godina,
  dnevniCiljSati: auth.korisnik.dnevniCiljSati,
})

const pretvori = (podaci) => ({
  ...podaci,
  godina: Number(podaci.godina),
  dnevniCiljSati: Number(podaci.dnevniCiljSati),
})

const { obrazac, promijenjeno, spremljeno, spremi, odbaci } = useProfileForm(pocetno, pretvori)

const KRIVA_LOZINKA = ['auth/invalid-credential', 'auth/wrong-password']

const lozinkaModal = ref(false)
const saljeLozinku = ref(false)
const porukaLozinke = ref('')
const greskaModala = ref('')

function otvoriLozinku() {
  greskaModala.value = ''
  porukaLozinke.value = ''
  lozinkaModal.value = true
}

async function spremiLozinku({ trenutna, nova }) {
  const promjena = auth.imaLozinku
  saljeLozinku.value = true
  greskaModala.value = ''
  try {
    if (promjena) await auth.promijeniLozinku(trenutna, nova)
    else await auth.postaviLozinku(nova)
    lozinkaModal.value = false
    porukaLozinke.value = promjena
      ? 'Lozinka je promijenjena.'
      : 'Lozinka je postavljena. Odsad se možete prijaviti i adresom e-pošte.'
  } catch (iznimka) {
    greskaModala.value = KRIVA_LOZINKA.includes(iznimka.code)
      ? 'Trenutna lozinka nije točna.'
      : porukaGreske(iznimka)
  }
  saljeLozinku.value = false
}

async function deaktiviraj() {
  const potvrda = await pitaj({
    naslov: 'Deaktivacija računa',
    tekst:
      'Deaktivirati račun? Ukoliko se poželite vratiti, račun može biti ponovno aktiviran od strane administratora',
    gumb: 'Deaktiviraj',
  })
  if (!potvrda) return
  if (!(await pokusaj(auth.deaktiviraj))) return
  router.push('/')
}
</script>

<template>
  <div>
    <PageHeading title="Profil" subtitle="Osobni podaci, dnevni cilj i sigurnost računa." />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <BaseCard class="lg:col-span-2">
        <div class="mb-6 flex items-center gap-4 sm:gap-5">
          <Avatar :ime="obrazac.ime" size="h-16 w-16 text-xl sm:h-20 sm:w-20 sm:text-2xl" />
          <div class="min-w-0">
            <p class="text-xl font-bold wrap-break-word text-slate-900 sm:text-2xl">
              {{ obrazac.ime }}
            </p>
            <p class="text-sm text-slate-500">
              {{ auth.jeAdmin ? 'Administrator' : 'Student' }} • {{ obrazac.godina }}. godina
            </p>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="spremi">
          <BaseInput v-model="obrazac.ime" label="Ime i prezime" />
          <div>
            <FieldLabel>Adresa e-pošte</FieldLabel>
            <p class="rounded-xl bg-slate-100 px-4 py-3 break-all text-slate-500">
              {{ auth.korisnik.email }}
            </p>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="sm:col-span-2">
              <BaseInput
                v-model="obrazac.sveuciliste"
                label="Sveučilište"
                placeholder="npr. Sveučilište u Puli"
              />
            </div>
            <BaseInput v-model="obrazac.godina" label="Godina" type="number" />
          </div>
          <BaseInput v-model="obrazac.dnevniCiljSati" label="Dnevni cilj (sati)" type="number" />
        </form>
      </BaseCard>

      <BaseCard>
        <p class="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
          <Icon name="stit" />
          Sigurnost
        </p>
        <BaseButton variant="secondary" block @click="otvoriLozinku">
          {{ auth.imaLozinku ? 'Promijeni lozinku' : 'Postavi lozinku' }}
        </BaseButton>

        <p v-if="porukaLozinke" class="mt-2 text-xs font-semibold text-sb-teal">
          {{ porukaLozinke }}
        </p>
        <p v-else class="mt-2 text-xs text-slate-500">
          {{
            auth.imaLozinku
              ? 'Lozinku mijenjate ovdje, uz potvrdu trenutne.'
              : 'Račun je otvoren Google prijavom i još nema lozinku.'
          }}
        </p>

        <MicroLabel class="mt-5 mb-2">Povezani računi</MicroLabel>
        <div class="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3">
          <span class="flex items-center gap-2 text-sm text-slate-700">
            <Icon name="korisnik" size="h-4 w-4" />
            Google
          </span>
          <span
            class="text-sm font-semibold"
            :class="auth.korisnik.googleId ? 'text-sb-teal' : 'text-slate-400'"
          >
            {{ auth.korisnik.googleId ? 'Povezano' : 'Nije povezano' }}
          </span>
        </div>
      </BaseCard>
    </div>

    <div class="rounded-card mt-6 flex flex-wrap items-center justify-between gap-4 bg-red-50 p-6">
      <div>
        <p class="text-xl font-bold text-red-700">Opasna zona</p>
        <p class="mt-1 text-sm text-red-600">
          Nakon deaktivacije računa morate kontaktirati administratora za ponovnu aktivaciju.
        </p>
      </div>
      <div class="flex gap-3">
        <BaseButton variant="outline" @click="odjava">Odjava</BaseButton>
        <BaseButton variant="danger" @click="deaktiviraj">Deaktiviraj račun</BaseButton>
      </div>
    </div>

    <SaveBar
      :promijenjeno="promijenjeno"
      :spremljeno="spremljeno"
      @spremi="spremi"
      @odbaci="odbaci"
    />
    <PasswordModal
      v-model="lozinkaModal"
      :promjena="auth.imaLozinku"
      :salje="saljeLozinku"
      :greska="greskaModala"
      @spremi="spremiLozinku"
    />
    <ConfirmModal :upit="upit" @odgovor="odgovori" />
  </div>
</template>
