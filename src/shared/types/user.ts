export interface ProfileData{
    userId: number
    email: string
    nickname: string
    role: string
    provider: string
    profileImage: string
}

export interface ProfileEditData {
    nickname: string | null
    profileImageKey: string | null
}