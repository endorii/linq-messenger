import { httpService } from "@/shared/api/httpService";
import { IUser } from "../interfaces/IUser";

export async function fetchUniqueUsername(username: string) {
    if (!username) return null;
    try {
        const { data } = await httpService.get(`/users/${username}`);
        return { available: true, message: data.message };
    } catch (error: any) {
        if (error.response?.status === 409) {
            return { available: false };
        }
        throw error;
    }
}

export async function fetchUpdateUser(updateUserData: Partial<IUser>) {
    const { data } = await httpService.patch(`/users`, updateUserData);
    return data;
}
