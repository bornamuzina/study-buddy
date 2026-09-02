<script setup>
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import MicroLabel from '../components/ui/MicroLabel.vue'
import { useAuthForm } from '../composables/authForm'

const { email, lozinka, salje, greska, greskaEmaila, greskaLozinke, posalji, google } =
  useAuthForm('registracija')
</script>

<template>
  <div class="flex justify-center px-4 py-12 sm:px-6 sm:py-20">
    <form class="w-full max-w-md" @submit.prevent="posalji">
      <h1 class="text-center text-3xl font-bold text-slate-900 sm:text-4xl">Otvorite račun</h1>
      <p class="mt-3 mb-8 text-center text-slate-500">Pridružite se više od 5 studenata.</p>

      <BaseButton type="button" variant="outline" block :disabled="salje" @click="google"
        >Registracija putem Googlea</BaseButton
      >

      <div class="my-6 flex items-center gap-4">
        <span class="h-px flex-1 bg-slate-200" />
        <MicroLabel>ili koristite e-poštu</MicroLabel>
        <span class="h-px flex-1 bg-slate-200" />
      </div>

      <div class="space-y-4">
        <BaseInput
          v-model="email"
          label="Adresa e-pošte"
          type="email"
          placeholder="name@university.edu"
          :error="greskaEmaila"
        />
        <BaseInput
          v-model="lozinka"
          label="Lozinka"
          type="password"
          placeholder="••••••••••"
          :error="greskaLozinke"
        />
        <BaseButton block :disabled="salje">
          {{ salje ? 'Izrada računa' : 'Izradi račun' }}
        </BaseButton>
      </div>

      <p v-if="greska" class="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
        {{ greska }}
      </p>

      <p class="mt-4 text-center text-xs text-slate-500">
        Registracijom prihvaćate naše
        <RouterLink to="/uvjeti" class="transition text-sb-indigo">
          Uvjete pružanja usluge
        </RouterLink>
      </p>
      <p class="mt-6 text-center text-sm text-slate-500">
        Već imate račun?
        <RouterLink to="/prijava" class="font-semibold text-sb-indigo">Prijavite se</RouterLink>
      </p>
    </form>
  </div>
</template>
