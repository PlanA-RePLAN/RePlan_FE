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