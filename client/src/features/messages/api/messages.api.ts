import { httpService } from "@/shared/api/httpService";
import { IMessage, MessagePayload } from "@/shared/interfaces/IMessage";

export async function fetchMessages(chatId: string): Promise<IMessage[]> {
    const { data } = await httpService.get(`/chats/${chatId}/messages`);
    return data;
}
export async function fetchCreateMessage(chatId: string, messagePayload: MessagePayload) {
    const { data } = await httpService.post(`/chats/${chatId}/messages`, messagePayload);
    return data;
}

export async function fetchUpdateMessage(
    messageId: string,
    updateMessagePayload: Partial<MessagePayload>
) {
    const { data } = await httpService.patch(`/messages/${messageId}`, updateMessagePayload);
    return data;
}
