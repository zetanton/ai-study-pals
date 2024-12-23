import { ref, computed } from 'vue'
import axios from 'axios'

interface Student {
  id: number
  name: string
  email: string
  studentCode: string
}

export function useEducatorStudents() {
  const students = ref<Student[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const licenseLimit = ref<number | null>(null)

  const canAddMoreStudents = computed(() => {
    if (!licenseLimit.value) return true
    return students.value.length < licenseLimit.value
  })

  const fetchStudents = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('/api/educator/students')
      students.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch students'
      console.error('Error fetching students:', err)
    } finally {
      loading.value = false
    }
  }

  const addStudent = async (studentData: { name: string; email: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post('/api/educator/add-student', studentData)
      await fetchStudents() // Refresh the list
      return response.data.studentCode
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add student'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const addExistingStudent = async (studentCode: string) => {
    loading.value = true
    error.value = null
    try {
      await axios.post('/api/educator/add-existing-student', { studentCode })
      await fetchStudents() // Refresh the list
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add student'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const removeStudent = async (studentId: number) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`/api/educator/remove-student/${studentId}`)
      await fetchStudents() // Refresh the list
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to remove student'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const deleteStudent = async (studentId: number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.delete(`/api/educator/delete-student/${studentId}`);
      if (response.status === 200) {
        await fetchStudents(); // Refresh the list
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete student';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const updateStudent = async (studentId: number, data: { name: string; email: string }) => {
    loading.value = true
    error.value = null
    try {
      await axios.put(`/api/educator/update-student/${studentId}`, data)
      await fetchStudents() // Refresh the list
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update student'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    students,
    loading,
    error,
    licenseLimit,
    canAddMoreStudents,
    fetchStudents,
    addStudent,
    addExistingStudent,
    removeStudent,
    deleteStudent,
    updateStudent
  }
}