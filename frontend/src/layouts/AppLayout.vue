<script setup>
import { ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Sidebar from '../components/Sidebar.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const izbornikOtvoren = ref(false)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Header izbornik @izbornik="izbornikOtvoren = true" />
    <div v-if="auth.prijavljen" class="flex flex-1">
      <Sidebar v-model="izbornikOtvoren" />
      <main class="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <RouterView />
      </main>
    </div>
    <Footer />
  </div>
</template>
