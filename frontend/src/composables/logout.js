import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export function useLogout() {
  const auth = useAuthStore()
  const router = useRouter()

  return async function odjava() {
    await auth.odjava()
    router.push('/')
  }
}
