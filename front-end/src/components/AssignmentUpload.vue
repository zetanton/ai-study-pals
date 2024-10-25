<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <h3 class="text-xl font-bold text-[#2e3856] mb-4">Upload Assignment</h3>
    <div class="space-y-4">
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
        :disabled="!selectedFile"
        class="w-full px-4 py-2 bg-[#00a3ff] text-white rounded-full font-semibold hover:bg-[#0082cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Upload Assignment
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedFile = ref<File | null>(null)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedFile.value = target.files[0]
  }
}

const uploadFile = async () => {
  if (!selectedFile.value) return

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const response = await fetch('/api/upload-assignment', {
      method: 'POST',
      body: formData
    })
    const result = await response.json()
    console.log('Assignment uploaded:', result)
    // Handle successful upload (e.g., show success message, update UI)
    selectedFile.value = null // Reset the file input after successful upload
  } catch (error) {
    console.error('Error uploading assignment:', error)
    // Handle error (e.g., show error message)
  }
}
</script>
