import { create } from "zustand"
import { type Provider } from "@/features/mypage/components/LogoIcon"

interface ProfileState {
    name: string | null
    profileImageUrl: string | null
    email: string | null
    provider: Provider | null
    setProfile: (name: string | null, profileImageUrl: string | null, email: string | null, provider: Provider | null) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
    name: null,
    profileImageUrl: null,
    email: null,
    provider: null,
    setProfile: (name, profileImageUrl, email, provider) => set({ name, profileImageUrl, email, provider })
}))
