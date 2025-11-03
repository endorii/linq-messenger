import { httpService } from "@/shared/api/httpService";
import { ServerResponseError } from "@/shared/interfaces/ServerResponseError";
import { AxiosError } from "axios";
import { IUser } from "../../../shared/interfaces/IUser";

export async function fetchUniqueUsername(username: string) {
    if (!username) return null;

    try {
        const { data } = await httpService.get<{ message: string }>(`/users/${username}`);
        return { available: true, message: data.message };
    } catch (error) {
        const axiosError = error as AxiosError<ServerResponseError>;

        if (axiosError.response?.status === 409) {
            return { available: false };
        }

        throw axiosError;
    }
}

export async function fetchUpdateUser(updateUserData: Partial<IUser>) {
    try {
        const { data } = await httpService.patch<IUser>("/users", updateUserData);
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ServerResponseError>;
        throw axiosError;
    }
}
