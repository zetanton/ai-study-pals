import { ref } from 'vue'
import axios from 'axios'

interface Child {
  id: number
  name: string
  email: string
  studentCode: string
}

export function useParentChildren() {
  const children = ref<Child[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchChildren = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('/api/parent/children')
      children.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch children'
      console.error('Error fetching children:', err)
    } finally {
      loading.value = false
    }
  }

  const createChild = async (childData: { name: string; email: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post('/api/parent/create-child', childData)
      await fetchChildren()
      return response.data.studentCode
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create child'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const addChild = async (studentCode: string) => {
    loading.value = true
    error.value = null
    try {
      await axios.post('/api/parent/add-child', { studentCode })
      await fetchChildren()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add child'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const deleteChild = async (childId: number) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`/api/parent/remove-child/${childId}`)
      await fetchChildren() // Refresh the list
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to remove child'
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  return {
    children,
    loading,
    error,
    fetchChildren,
    createChild,
    addChild,
    deleteChild
  }
} 