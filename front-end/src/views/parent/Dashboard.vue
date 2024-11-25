<template>
  <div class="space-y-8">
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-[#2e3856]">Parent Dashboard</h1>
          <p class="text-gray-600">Monitor your child's progress</p>
        </div>
        <div class="flex items-center space-x-4">
          <RouterLink 
            to="/profile" 
            class="btn-secondary flex items-center space-x-2"
          >
            <span>Profile Settings</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
          </RouterLink>
          <button 
            @click="showAddModal = true"
            class="btn-primary"
          >
            Add Child
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">85%</div>
          <div class="text-gray-600">Overall Progress</div>
        </div>
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">12</div>
          <div class="text-gray-600">Hours Studied</div>
        </div>
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">15</div>
          <div class="text-gray-600">Medals Earned</div>
        </div>
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">92%</div>
          <div class="text-gray-600">Assignment Score</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-[#2e3856] mb-4">My Children</h2>
          <div v-if="loading" class="text-center py-8">Loading...</div>
          <div v-else-if="error" class="text-center text-red-500 py-8">{{ error }}</div>
          <div v-else-if="children.length === 0" class="text-center text-gray-500 py-8">
            <p>No children added yet</p>
            <button 
              @click="showAddModal = true"
              class="text-[#00a3ff] hover:underline mt-2"
            >
              Add your first child
            </button>
          </div>
          <div v-else class="space-y-4">
            <div v-for="child in children" :key="child.id" class="p-4 bg-[#f7f9fc] rounded-xl">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                    {{ child.name[0] }}
                  </div>
                  <span class="font-semibold text-[#2e3856]">{{ child.name }}</span>
                </div>
                <div class="flex items-center space-x-4">
                  <span class="text-sm text-gray-500">Code: {{ child.studentCode }}</span>
                  <button 
                    @click="handleDeleteChild(child.id)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-[#2e3856] mb-4">Recent Activity</h2>
          <div class="space-y-4">
            <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-[#f7f9fc] rounded-full flex items-center justify-center">
                {{ activity.icon }}
              </div>
              <div>
                <div class="font-semibold text-[#2e3856]">{{ activity.title }}</div>
                <div class="text-sm text-gray-500">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-[#2e3856] mb-4">Recommendations</h2>
          <div class="space-y-4">
            <div v-for="rec in recommendations" :key="rec.id" class="p-4 bg-[#f7f9fc] rounded-xl">
              <div class="font-semibold text-[#2e3856] mb-1">{{ rec.title }}</div>
              <p class="text-sm text-gray-600">{{ rec.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AddChildModal
    :show="showAddModal"
    @close="showAddModal = false"
    @child-added="handleChildAdded"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'
import { useParentChildren } from '../../composables/useParentChildren'
import AddChildModal from '../../components/AddChildModal.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const router = useRouter()
const showAddModal = ref(false)

const {
  children,
  loading,
  error,
  fetchChildren,
  deleteChild
} = useParentChildren()

onMounted(async () => {
  if (user.value?.role !== 'parent') {
    router.push('/unauthorized')
    return
  }
  await fetchChildren()
})

const handleChildAdded = async () => {
  await fetchChildren()
}

const handleDeleteChild = async (childId: number) => {
  if (!confirm('Are you sure you want to remove this child? This action cannot be undone.')) {
    return
  }
  
  try {
    await deleteChild(childId)
  } catch (err) {
    console.error('Failed to delete child:', err)
  }
}

const recentActivity = [
  {
    id: 1,
    icon: '📚',
    title: 'Completed Math Assignment',
    time: '2 hours ago'
  },
  {
    id: 2,
    icon: '🏅',
    title: 'Earned New Medal',
    time: '5 hours ago'
  },
  {
    id: 3,
    icon: '📝',
    title: 'Started Science Quiz',
    time: 'Yesterday'
  }
]

const recommendations = [
  {
    id: 1,
    title: 'Focus on English',
    description: 'Schedule more reading sessions to improve comprehension.'
  },
  {
    id: 2,
    title: 'Math Practice',
    description: 'Review fractions and decimals for upcoming test.'
  }
]
</script>