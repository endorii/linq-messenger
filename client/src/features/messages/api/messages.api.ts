import { httpService } from "@/shared/api/httpService";
import {
    ForwardMessagePayload,
    ForwardMessagesPayload,
    IMessage,
    MessagePayload,
} from "@/shared/interfaces/IMessage";

export async function fetchMessages(chatId: string): Promise<IMessage[]> {
    const { data } = await httpService.get(`/chats/${chatId}/messages`);
    return data;
}

export async function fetchUpdateReadMessages(fetchUpdateReadMessagesPayload: {
    messageIds: string[];
}) {
    const { data } = await httpService.patch(`/messages/read`, fetchUpdateReadMessagesPayload);
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

export async function fetchForwardMessage(forwardMessagePayload: ForwardMessagePayload) {
    const { data } = await httpService.post(`/messages/forward`, forwardMessagePayload);
    return data;
}

export async function fetchForwardMessages(forwardMessagesPayload: ForwardMessagesPayload) {
    const { data } = await httpService.post(`/messages/forwardMany`, forwardMessagesPayload);
    return data;
}

export async function fetchDeleteMessageForMe(messageId: string) {
    const { data } = await httpService.post(`/messages/${messageId}/deleteForMe`);
    return data;
}

export async function fetchDeleteMessage(messageId: string) {
    const { data } = await httpService.patch(`/messages/${messageId}/delete`);
    return data;
}

export async function fetchDeleteMessagesForMe(messageIds: string[]) {
    const { data } = await httpService.post(`/messages/deleteForMe`, { messageIds });
    return data;
}

export async function fetchDeleteMessages(messageIds: string[]) {
    const { data } = await httpService.patch(`/messages/delete`, { messageIds });
    return data;
}
