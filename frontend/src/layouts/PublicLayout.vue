<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Sidebar from '../components/Sidebar.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const route = useRoute()

const izbornikOtvoren = ref(false)

const prikaziIzbornik = computed(() => auth.prijavljen && !route.meta.gost)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Header :izbornik="prikaziIzbornik" @izbornik="izbornikOtvoren = true" />
    <Sidebar v-if="prikaziIzbornik" v-model="izbornikOtvoren" samo-drawer />
    <main class="flex-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
