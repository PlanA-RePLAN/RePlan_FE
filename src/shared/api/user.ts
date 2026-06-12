import client from "./client";
import { ApiResponse } from '@/shared/types/auth'
import { MyInfoData } from '@/shared/types/user'

export async function getMyInfo (
    accessToken: string
) : Promise<ApiResponse<MyInfoData>>{
     const res = await client.get<ApiResponse<MyInfoData>>('/api/users/me',{
        headers: { Authorization: `Bearer ${accessToken}` }
     })
     return res.data
}