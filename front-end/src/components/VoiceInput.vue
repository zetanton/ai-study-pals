<template>
  <div v-if="isListening" class="text-sm text-gray-500 mt-2">
    Listening...
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  class SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    
    // Event handlers
    onstart: ((event: Event) => void) | null;
    onend: ((event: Event) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onaudiostart: ((event: Event) => void) | null;
    onaudioend: ((event: Event) => void) | null;
    onsoundstart: ((event: Event) => void) | null;
    onsoundend: ((event: Event) => void) | null;
    onspeechstart: ((event: Event) => void) | null;
    onspeechend: ((event: Event) => void) | null;

    // Methods
    abort(): void;
    start(): void;
    stop(): void;
  }

  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
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
const finalTranscript = ref('')

let recognition: SpeechRecognition | null = null
let silenceTimeout: number | null = null
const SILENCE_TIMEOUT = 3000 // Stop recording after 3 seconds of silence

const initializeSpeechRecognition = () => {
  const hasSpeechRecognition = 'SpeechRecognition' in window
  const hasWebkit = 'webkitSpeechRecognition' in window
  
  if (!hasSpeechRecognition && !hasWebkit) {
    console.warn('Speech recognition not supported in this browser')
    return
  }

  try {
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognitionConstructor()
    
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onresult = handleRecognitionResult
    recognition.onend = handleRecognitionEnd
    recognition.onerror = handleRecognitionError
  } catch (error) {
    console.error('Error initializing speech recognition:', error)
  }
}

const handleRecognitionResult = (event: SpeechRecognitionEvent) => {
  let interimTranscript = ''
  
  if (silenceTimeout) {
    clearTimeout(silenceTimeout)
  }
  
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const result = event.results[i]
    if (result.isFinal) {
      finalTranscript.value += result[0].transcript + ' '
    } else {
      interimTranscript += result[0].transcript
    }
  }
  
  transcript.value = finalTranscript.value + interimTranscript

  silenceTimeout = window.setTimeout(() => {
    if (recognition && props.isListening) {
      recognition.stop()
    }
  }, SILENCE_TIMEOUT)
}

const handleRecognitionEnd = () => {
  if (finalTranscript.value.trim()) {
    emit('transcript', finalTranscript.value.trim())
  }

  finalTranscript.value = ''
  transcript.value = ''
  
  if (silenceTimeout) {
    clearTimeout(silenceTimeout)
    silenceTimeout = null
  }

  emit('updateListening', false)
}

const handleRecognitionError = (event: SpeechRecognitionErrorEvent) => {
  if (silenceTimeout) {
    clearTimeout(silenceTimeout)
    silenceTimeout = null
  }

  if (event.error === 'no-speech' && props.isListening) {
    emit('updateListening', false)
  }
}

onMounted(() => {
  initializeSpeechRecognition()
})

watch(() => props.isListening, async (newValue) => {
  if (!recognition) {
    return
  }

  if (newValue) {
    try {
      await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      transcript.value = ''
      finalTranscript.value = ''
      recognition.start()
      
    } catch (error) {
      emit('updateListening', false)
    }
  } else {
    recognition.stop()
  }
})

onUnmounted(() => {
  if (silenceTimeout) {
    clearTimeout(silenceTimeout)
  }
  if (recognition) {
    recognition.stop()
  }
})
</script>
