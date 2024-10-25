<template>
  <div class="space-y-8">
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-[#2e3856]">Educator Dashboard</h1>
          <p class="text-gray-600">Monitor your students' progress</p>
        </div>
        <div class="flex items-center space-x-4">
          <button class="btn-secondary">Export Report</button>
          <button class="btn-primary">Add Student</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">25</div>
          <div class="text-gray-600">Total Students</div>
        </div>
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">87%</div>
          <div class="text-gray-600">Class Average</div>
        </div>
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">156</div>
          <div class="text-gray-600">Lessons Completed</div>
        </div>
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">92%</div>
          <div class="text-gray-600">Engagement Rate</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-[#2e3856] mb-4">Student Performance</h2>
          <div class="space-y-4">
            <div v-for="student in students" :key="student.id" class="p-4 bg-[#f7f9fc] rounded-xl">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-[#00a3ff] rounded-full flex items-center justify-center text-white font-bold">
                    {{ student.name[0] }}
                  </div>
                  <span class="font-semibold text-[#2e3856]">{{ student.name }}</span>
                </div>
                <div class="flex items-center space-x-4">
                  <span class="text-[#00a3ff]">{{ student.score }}%</span>
                  <button class="text-gray-500 hover:text-[#00a3ff]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-[#00a3ff] h-2 rounded-full" 
                  :style="{ width: `${student.score}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-[#2e3856] mb-4">Subject Overview</h2>
          <div class="space-y-4">
            <div v-for="subject in subjects" :key="subject.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-[#f7f9fc] rounded-full flex items-center justify-center">
                  {{ subject.icon }}
                </div>
                <span class="font-semibold text-[#2e3856]">{{ subject.name }}</span>
              </div>
              <span class="text-[#00a3ff]">{{ subject.average }}%</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-[#2e3856] mb-4">Recent Activity</h2>
          <div class="space-y-4">
            <div v-for="activity in recentActivity" :key="activity.id" class="p-4 bg-[#f7f9fc] rounded-xl">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center">
                  {{ activity.icon }}
                </div>
                <div>
                  <div class="font-semibold text-[#2e3856]">{{ activity.title }}</div>
                  <div class="text-sm text-gray-500">{{ activity.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const students = [
  { id: 1, name: 'Alice Johnson', score: 92 },
  { id: 2, name: 'Bob Smith', score: 85 },
  { id: 3, name: 'Carol Williams', score: 78 },
  { id: 4, name: 'David Brown', score: 95 },
  { id: 5, name: 'Emma Davis', score: 88 }
]

const subjects = [
  { name: 'Mathematics', icon: '🔢', average: 85 },
  { name: 'Science', icon: '🔬', average: 92 },
  { name: 'English', icon: '📚', average: 88 },
  { name: 'History', icon: '🏛️', average: 90 },
  { name: 'Social Studies', icon: '🌍', average: 87 }
]

const recentActivity = [
  {
    id: 1,
    icon: '📝',
    title: 'Math Quiz Completed',
    time: 'Class average: 88%'
  },
  {
    id: 2,
    icon: '🏅',
    title: '5 New Medals Earned',
    time: 'By various students'
  },
  {
    id: 3,
    icon: '📚',
    title: 'Science Project Due',
    time: '15 submissions received'
  }
]
</script>