import { ServerResponseWithMessage } from "@/features/auth/interfaces/auth.interfaces";
import { httpService } from "@/shared/api/httpService";
import { IChat } from "@/shared/interfaces/IChat";

export async function fetchAllUserChats(): Promise<IChat[]> {
    const { data } = await httpService.get("/chats");
    return data;
}

// export async function resendVerifyUser(email: string): Promise<ServerResponseWithMessage> {
//     const { data } = await httpService.post("/auth/resend-verification", { email });
//     return data;
// }
