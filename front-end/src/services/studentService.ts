interface StudentStats {
  completedLessons: number
  earnedMedals: number
  averageScore: number
}

export async function fetchStudentStats(): Promise<StudentStats> {
  try {
    const response = await fetch('/api/student/stats')
    return await response.json()
  } catch (error) {
    console.error('Error fetching student stats:', error)
    throw error
  }
} 