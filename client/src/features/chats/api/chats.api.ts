import { ServerResponseWithMessage } from "@/features/auth/interfaces/auth.interfaces";
import { httpService } from "@/shared/api/httpService";
import { IChat } from "@/shared/interfaces/IChat";

export async function fetchChats(): Promise<IChat[]> {
    const { data } = await httpService.get("/chats");
    return data;
}

export async function fetchChat(chatId: string): Promise<IChat> {
    const { data } = await httpService.get(`/chats/${chatId}`);
    return data;
}
