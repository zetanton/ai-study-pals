import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Landing from '../views/Landing.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import StudentDashboard from '../views/student/Dashboard.vue'
import ParentDashboard from '../views/parent/Dashboard.vue'
import EducatorDashboard from '../views/educator/Dashboard.vue'
import SubjectRoom from '../views/student/SubjectRoom.vue'
import Pricing from '../views/Pricing.vue'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: Landing,
    meta: { public: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { public: true }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { public: true }
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: Pricing,
    meta: { public: true }
  },
  {
    path: '/student',
    name: 'student',
    component: StudentDashboard,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/subject/:id',
    name: 'subject',
    component: SubjectRoom,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/parent',
    name: 'parent',
    component: ParentDashboard,
    meta: { requiresAuth: true, role: 'parent' }
  },
  {
    path: '/educator',
    name: 'educator',
    component: EducatorDashboard,
    meta: { requiresAuth: true, role: 'educator' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.user?.role

  if (!to.meta.public && !isAuthenticated) {
    next('/login')
    return
  }

  if (to.meta.role && userRole !== to.meta.role) {
    next(`/${userRole}`)
    return
  }

  next()
})

export default router