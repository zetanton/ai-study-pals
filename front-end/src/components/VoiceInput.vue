<template>
  <!-- This component no longer needs a template -->
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Add these type declarations at the top of the <script> section
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

const props = defineProps<{
  isListening: boolean
}>()

const emit = defineEmits<{
  (e: 'transcript', value: string): void
  (e: 'updateListening', value: boolean): void
}>()

const transcript = ref('')

let recognition: SpeechRecognition | null = null

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
  recognition.continuous = true
  recognition.interimResults = true

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1]
    transcript.value = result[0].transcript
  }

  recognition.onend = () => {
    emit('updateListening', false)
  }
}

watch(() => props.isListening, (newValue) => {
  if (newValue) {
    recognition?.start()
  } else {
    recognition?.stop()
    emit('transcript', transcript.value)
    transcript.value = ''
  }
})
</script>
