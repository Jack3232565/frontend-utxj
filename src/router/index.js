import { createRouter, createWebHistory } from 'vue-router'

// Importamos las vistas que acabamos de crear
import FormularioView from '../views/FormularioView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: FormularioView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/admin',
    name: 'admin',
    component: DashboardView,
    meta: { requiresAuth: true } // Marca esta ruta como PROTEGIDA
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// GUARDIA DE NAVEGACIÓN (El portero de seguridad)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') // Revisamos si hay token guardado

  // Si la ruta requiere autenticación y NO hay token...
  if (to.meta.requiresAuth && !token) {
    next('/login') // ...lo mandamos al login.
  } else {
    next() // Si todo bien, pasa.
  }
})

export default router