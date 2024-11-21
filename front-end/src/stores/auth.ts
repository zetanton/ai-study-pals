import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'parent' | 'educator'
  subscription?: 'free' | 'basic' | 'premium'
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  name: string
  role: 'student' | 'parent' | 'educator'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async login({ email, password }: LoginCredentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/api/auth/login', {
          email,
          password
        })

        if (response.data.user) {
          this.user = response.data.user
          this.isAuthenticated = true
          // Store the token if your backend provides one
          if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
          }
          return true
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to login'
        throw new Error(this.error || 'Failed to login')
      } finally {
        this.loading = false
      }
    },

    async register(userData: RegisterData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/api/auth/register', userData)

        if (response.data.user) {
          this.user = response.data.user
          this.isAuthenticated = true
          // Store the token if your backend provides one
          if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
          }
          return true
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to register'
        throw new Error(this.error || 'Failed to register')
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    // Initialize auth state from token
    async initAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        try {
          const response = await axios.get('/api/auth/me')
          this.user = response.data.user
          this.isAuthenticated = true
        } catch (error) {
          this.logout()
        }
      }
    }
  }
})