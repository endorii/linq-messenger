import { ServerResponseWithMessage } from "@/features/auth/interfaces/auth.interfaces";
import { httpService } from "@/shared/api/httpService";
import { ChannelPayload, GroupChatPayload, IChat } from "@/shared/interfaces/IChat";

export async function fetchChats(): Promise<IChat[]> {
    const { data } = await httpService.get("/chats");
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

export async function fetchCreateGroupChat(
    groupChatPayload: GroupChatPayload
): Promise<ServerResponseWithMessage<IChat>> {
    const { data } = await httpService.post(`/chats/group`, groupChatPayload);
    return data;
}

export async function fetchCreateChannel(
    channelPayload: ChannelPayload
): Promise<ServerResponseWithMessage<IChat>> {
    const { data } = await httpService.post(`/chats/channel`, channelPayload);
    return data;
}

export async function fetchDeleteChat(chatId: string): Promise<ServerResponseWithMessage> {
    const { data } = await httpService.delete(`/chats/${chatId}`);
    return data;
}
