<template>
  <div class="min-h-screen bg-[#f7f9fc]">
    <NavBar />
    <div class="pt-16">
      <main>
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
</script>

<style>
.btn-primary {
  @apply px-4 py-2 bg-[#00a3ff] text-white rounded-full font-semibold hover:bg-[#0082cc] transition-colors;
}

.btn-secondary {
  @apply px-4 py-2 bg-white text-[#2e3856] border-2 border-[#2e3856] rounded-full font-semibold hover:bg-gray-50 transition-colors;
}
</style>