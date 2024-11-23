<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold text-[#2e3856] mb-4">Add New Student</h2>
      
      <div class="mb-6">
        <div class="flex space-x-4">
          <button 
            @click="mode = 'create'"
            :class="[
              'flex-1 py-2 px-4 rounded-lg',
              mode === 'create' 
                ? 'bg-[#00a3ff] text-white' 
                : 'bg-gray-100 text-gray-600'
            ]"
          >
            Create New
          </button>
          <button 
            @click="mode = 'code'"
            :class="[
              'flex-1 py-2 px-4 rounded-lg',
              mode === 'code' 
                ? 'bg-[#00a3ff] text-white' 
                : 'bg-gray-100 text-gray-600'
            ]"
          >
            Add by Code
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <template v-if="mode === 'create'">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
            >
          </div>
        </template>

        <template v-else>
          <div>
            <label class="block text-sm font-medium text-gray-700">Student Code</label>
            <input
              v-model="form.studentCode"
              type="text"
              required
              placeholder="Enter student code"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
            >
          </div>
        </template>

        <div class="flex justify-end space-x-3 mt-6">
          <button 
            type="button"
            @click="$emit('close')"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Adding...' : 'Add Student' }}
          </button>
        </div>
      </form>

      <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-lg">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <div v-if="studentCode" class="mt-4 p-4 bg-green-50 rounded-lg">
        <p class="text-green-800 font-medium">Student added successfully!</p>
        <p class="text-sm text-green-600">Student Code: {{ studentCode }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useEducatorStudents } from '../composables/useEducatorStudents'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'student-added'): void
}>()

const mode = ref<'create' | 'code'>('create')
const form = reactive({
  name: '',
  email: '',
  studentCode: ''
})

const loading = ref(false)
const error = ref('')
const studentCode = ref('')

const { addStudent, addExistingStudent } = useEducatorStudents()

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    if (mode.value === 'create') {
      const code = await addStudent({
        name: form.name,
        email: form.email
      })
      studentCode.value = code
      form.name = ''
      form.email = ''
    } else {
      await addExistingStudent(form.studentCode)
      form.studentCode = ''
    }
    
    emit('student-added')
    
    // Close modal after 3 seconds if showing success message
    if (studentCode.value) {
      setTimeout(() => {
        studentCode.value = ''
        emit('close')
      }, 3000)
    } else {
      emit('close')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.toString()
  } finally {
    loading.value = false
  }
}
</script> 