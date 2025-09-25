import { ServerResponseWithMessage } from "@/features/auth/interfaces/auth.interfaces";
import { httpService } from "@/shared/api/httpService";
import { IFolder } from "@/shared/interfaces/IFolder";

export async function fetchAllUserFolders(): Promise<IFolder[]> {
    const { data } = await httpService.get("/folders");
    return data;
}

// export async function resendVerifyUser(email: string): Promise<ServerResponseWithMessage> {
//     const { data } = await httpService.post("/auth/resend-verification", { email });
//     return data;
// }
