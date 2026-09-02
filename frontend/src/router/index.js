import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import PublicLayout from '../layouts/PublicLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import Homepage from '../pages/Homepage.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Info from '../pages/Info.vue'
import Dashboard from '../pages/Dashboard.vue'
import Subjects from '../pages/Subjects.vue'
import Statistics from '../pages/Statistics.vue'
import News from '../pages/News.vue'
import NewsPost from '../pages/NewsPost.vue'
import Profile from '../pages/Profile.vue'
import Settings from '../pages/Settings.vue'
import Help from '../pages/Help.vue'
import AdminOverview from '../pages/admin/Overview.vue'
import AdminUsers from '../pages/admin/Users.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', name: 'naslovnica', component: Homepage, meta: { gost: true } },
        { path: 'prijava', name: 'prijava', component: Login, meta: { gost: true } },
        { path: 'registracija', name: 'registracija', component: Register, meta: { gost: true } },
        { path: 'o-nama', name: 'o-nama', component: Info },
        { path: 'kontakt', name: 'kontakt', component: Info },
        { path: 'privatnost', name: 'privatnost', component: Info },
        { path: 'uvjeti', name: 'uvjeti', component: Info },
      ],
    },
    {
      path: '/',
      component: AppLayout,
      meta: { auth: true },
      children: [
        { path: 'ploca', name: 'ploca', component: Dashboard },
        { path: 'predmeti', name: 'predmeti', component: Subjects },
        { path: 'statistika', name: 'statistika', component: Statistics },
        { path: 'novosti', name: 'novosti', component: News },
        { path: 'novosti/:sadrzajId', name: 'novost', component: NewsPost },
        { path: 'profil', name: 'profil', component: Profile },
        { path: 'postavke', name: 'postavke', component: Settings },
        { path: 'pomoc', name: 'pomoc', component: Help },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { auth: true, admin: true },
      children: [
        { path: '', redirect: '/admin/pregled' },
        { path: 'pregled', name: 'admin-pregled', component: AdminOverview },
        { path: 'korisnici', name: 'admin-korisnici', component: AdminUsers },
      ],
    },
    { path: '/:putanja(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.auth && !auth.prijavljen) return { name: 'prijava' }
  if (to.meta.admin && !auth.jeAdmin) return { name: 'ploca' }
  if (to.meta.gost && auth.prijavljen) return { name: auth.jeAdmin ? 'admin-pregled' : 'ploca' }
})

export default router
