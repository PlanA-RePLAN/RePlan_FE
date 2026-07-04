export function getDayTag(
  routineType: string | null,
): 'D' | 'W' | 'M' | undefined {
  if (routineType === 'DAILY') return 'D'
  if (routineType === 'WEEKLY') return 'W'
  if (routineType === 'MONTHLY') return 'M'
  return undefined
}

export function formatTime(dueDate: string | null): string | undefined {
  if (!dueDate) return undefined
  const date = new Date(dueDate)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatHHmm(dueTime: string | null): string | undefined {
  if (!dueTime) return undefined
  const [h, m] = dueTime.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}
