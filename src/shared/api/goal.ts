import { GoalGroup } from "../types";
import { ApiResponse } from "../types/auth";
import client from "./client";

export async function getGoals(
    accessToken: string,
    year?: number,
    month?: number,
): Promise<ApiResponse<GoalGroup[]>>{
    const res = await client.get<ApiResponse<GoalGroup[]>>(
        '/api/goals',
        {   params: { year, month },
            headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return res.data
}

export async function deleteGoal(
    accessToken: string,
    id:  number,
): Promise<ApiResponse<null>>{
    const res = await client.delete<ApiResponse<null>>(
        `/api/goals/${id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return res.data
}