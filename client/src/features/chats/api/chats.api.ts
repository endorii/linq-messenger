import { ServerResponseWithMessage } from "@/features/auth/interfaces/auth.interfaces";
import { httpService } from "@/shared/api/httpService";
import { ChatPayload, IChat } from "@/shared/interfaces/IChat";
import { IFolderChat } from "@/shared/interfaces/IFolder";

export async function fetchChats(): Promise<IChat[]> {
    const { data } = await httpService.get("/chats");
    return data;
}

export async function fetchChatsByFolder(folderId: string): Promise<IChat[]> {
    const { data } = await httpService.get(`/chats/folder/${folderId}`);
    return data;
}

export async function fetchChat(chatId: string): Promise<IChat> {
    const { data } = await httpService.get(`/chats/${chatId}`);
    return data;
}

export async function fetchCreatePrivateChat(
    otherUserId: string | undefined
): Promise<ServerResponseWithMessage<IChat>> {
    const { data } = await httpService.post(`/chats/private`, { otherUserId });
    return data;
}

export async function fetchCreateChat(
    chatPayload: ChatPayload
): Promise<ServerResponseWithMessage<IChat>> {
    const { data } = await httpService.post(`/chats/chat`, chatPayload);
    return data;
}

export async function fetchUpdateChat(
    chatId: string,
    updateChatPayload: Partial<ChatPayload>
): Promise<ServerResponseWithMessage<IChat>> {
    console.log("data to sent", updateChatPayload);

    const { data } = await httpService.patch(`/chats/${chatId}`, updateChatPayload);
    return data;
}

export async function fetchLeaveChat(chatId: string): Promise<ServerResponseWithMessage> {
    const { data } = await httpService.post(`/chats/${chatId}/leave`);
    return data;
}

export async function fetchDeleteChat(chatId: string): Promise<ServerResponseWithMessage> {
    const { data } = await httpService.patch(`/chats/${chatId}/delete`);
    return data;
}
