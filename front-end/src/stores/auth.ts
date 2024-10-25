import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'parent' | 'educator'
  subscription?: 'free' | 'basic' | 'premium'
}

// Test users for development
const testUsers: User[] = [
  {
    id: '1',
    email: 'student@test.com',
    name: 'Test Student',
    role: 'student',
    subscription: 'basic'
  },
  {
    id: '2',
    email: 'parent@test.com',
    name: 'Test Parent',
    role: 'parent',
    subscription: 'premium'
  },
  {
    id: '3',
    email: 'educator@test.com',
    name: 'Test Educator',
    role: 'educator',
    subscription: 'premium'
  }
]

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false
  }),
  actions: {
    async login(email: string, password: string) {
      // Simulate API call
      const user = testUsers.find(u => u.email === email)
      if (user && password === 'password') {
        this.user = user
        this.isAuthenticated = true
        return true
      }
      throw new Error('Invalid credentials')
    },
    async register(userData: Partial<User>) {
      // Simulate API call
      const newUser = {
        id: String(testUsers.length + 1),
        email: userData.email!,
        name: userData.name!,
        role: userData.role!,
        subscription: 'free'
      }
      testUsers.push(newUser as User)
      this.user = newUser as User
      this.isAuthenticated = true
    },
    logout() {
      this.user = null
      this.isAuthenticated = false
    }
  }
})