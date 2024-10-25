import { defineStore } from 'pinia'

export interface Agent {
  id: string
  name: string
  subject: string
  avatar: string
  description: string
}

export const useAgentStore = defineStore('agents', {
  state: () => ({
    agents: [
      {
        id: 'science',
        name: 'Dr. Eureka',
        subject: 'Science',
        avatar: 'https://i.ibb.co/pZSGS44/DALL-E-2024-10-23-13-36-26-A-fun-Pixar-like-scientist-character-named-Dr-Eureka-resembling-Albert-Ei.webp',
        description: 'Your guide through scientific discoveries'
      },
      {
        id: 'math',
        name: 'Count Bot',
        subject: 'Mathematics',
        avatar: 'https://i.ibb.co/rHTwKkQ/DALL-E-2024-10-23-13-57-53-A-robot-character-named-Count-Bot-designed-to-resemble-the-style-from-the.webp',
        description: 'Your numerical navigation companion'
      },
      {
        id: 'ela',
        name: 'Wordsworth',
        subject: 'English Language Arts',
        avatar: 'https://i.ibb.co/t3nsZf2/DALL-E-2024-10-23-13-38-37-A-fun-Pixar-like-owl-character-named-Wordsworth-designed-for-teaching-Eng.webp',
        description: 'Your guide to language and literature'
      },
      {
        id: 'history',
        name: 'Chrono',
        subject: 'History',
        avatar: 'https://i.ibb.co/NF1gbRD/DALL-E-2024-10-23-13-54-05-A-Pixar-like-historian-character-named-Chrono-designed-to-resemble-an-exp.webp',
        description: 'Your time-traveling history expert'
      },
      {
        id: 'social',
        name: 'Mr. Sam',
        subject: 'Social Studies',
        avatar: 'https://i.ibb.co/WsN4y7B/DALL-E-2024-10-23-14-22-16-A-Pixar-like-character-named-Mr-Sam-designed-to-look-like-a-friendly-and.webp',
        description: 'Your guide to society and citizenship'
      }
    ] as Agent[]
  }),
  getters: {
    getAgentById: (state) => (id: string) => 
      state.agents.find(agent => agent.id === id)
  }
})