import client from "./client";
import { ApiResponse, PresignedUrlData } from '@/shared/types/auth'
import { ProfileData, ProfileEditData } from '@/shared/types/user'

export async function getProfile (
    accessToken: string
) : Promise<ApiResponse<ProfileData>>{
     const res = await client.get<ApiResponse<ProfileData>>('/api/users/profile',{
        headers: { Authorization: `Bearer ${accessToken}` }
     })
     return res.data
}

export async function editProfile (
    accessToken: string,   
    contentType: string,
    nickname?: string,
    profileImageKey?: string
) : Promise<ApiResponse<ProfileEditData>>{
    const res = await client.patch<ApiResponse<ProfileEditData>>(
        '/api/users/profile', 
        { nickname, profileImageKey },
        { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type' : contentType } 
    }
    )
    return res.data
}

export async function getProfileImagePresignedUrl(
    accessToken: string,
    filename: string,
    contentType: string,
): Promise<ApiResponse<PresignedUrlData>> {
    const res = await client.get<ApiResponse<PresignedUrlData>>(
        '/api/users/profile/image/presigned-url',
        {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { filename, contentType },
        },
    )
    return res.data
}
