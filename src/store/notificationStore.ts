import { create } from "zustand"

interface NotificationState {
    hasUnread: boolean
    setHasUnread: (v: boolean) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
    hasUnread: false,
    setHasUnread: (v) => set({ hasUnread: v})
}))