<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <h3 class="text-xl font-bold text-[#2e3856] mb-4">Upload Assignment</h3>
    
    <!-- Success message -->
    <div v-if="showSuccess" class="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
      Assignment uploaded successfully!
    </div>

    <!-- Error message -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
          <select
            id="subject"
            v-model="subject"
            required
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
          >
            <option value="">Select Subject</option>
            <option value="math">Mathematics</option>
            <option value="science">Science</option>
            <option value="english">English</option>
            <option value="history">History</option>
            <option value="social">Social Studies</option>
          </select>
        </div>
        <div>
          <label for="grade" class="block text-sm font-medium text-gray-700">Grade</label>
          <select
            id="grade"
            v-model="grade"
            required
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
          >
            <option value="">Select Grade</option>
            <option value="A">A (90-100)</option>
            <option value="B">B (80-89)</option>
            <option value="C">C (70-79)</option>
            <option value="D">D (60-69)</option>
            <option value="F">F (Below 60)</option>
          </select>
        </div>
      </div>

      <div class="flex items-center justify-center w-full">
        <label for="file-upload" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click to upload</span> or drag and drop</p>
            <p class="text-xs text-gray-500">PDF, DOC, or DOCX (MAX. 10MB)</p>
          </div>
          <input id="file-upload" type="file" class="hidden" @change="handleFileUpload" accept=".pdf,.doc,.docx" />
        </label>
      </div>

      <div v-if="selectedFile" class="text-sm text-gray-500">
        Selected file: {{ selectedFile.name }}
      </div>

      <button 
        @click="uploadFile" 
        :disabled="!canUpload || isLoading"
        class="w-full px-4 py-2 bg-[#00a3ff] text-white rounded-full font-semibold hover:bg-[#0082cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">Uploading...</span>
        <span v-else>Upload Assignment</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  defaultSubject?: string
}>()

const selectedFile = ref<File | null>(null)
const subject = ref('')
const grade = ref('')
const isLoading = ref(false)
const error = ref('')
const showSuccess = ref(false)

// Auto-populate subject if defaultSubject is provided
onMounted(() => {
  if (props.defaultSubject) {
    subject.value = props.defaultSubject
  }
})

const canUpload = computed(() => 
  selectedFile.value && subject.value && grade.value && !isLoading.value
)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedFile.value = target.files[0]
  }
}

const emit = defineEmits(['upload-complete'])

const uploadFile = async () => {
  if (!selectedFile.value || !subject.value || !grade.value) return
  
  isLoading.value = true
  error.value = ''
  showSuccess.value = false

  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('subject', subject.value)
  formData.append('grade', grade.value)

  try {
    const response = await fetch('/api/upload-assignment', {
      method: 'POST',
      body: formData
    })
    const result = await response.json()
    
    // Reset form
    selectedFile.value = null
    subject.value = props.defaultSubject || ''
    grade.value = ''
    
    showSuccess.value = true
    // Emit the new assignment data
    emit('upload-complete', result.assignment)
  } catch (err) {
    error.value = 'Failed to upload assignment. Please try again.'
    console.error('Error uploading:', err)
  } finally {
    isLoading.value = false
  }
}
</script>
