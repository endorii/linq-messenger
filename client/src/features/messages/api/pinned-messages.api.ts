import { httpService } from "@/shared/api/httpService";

export async function fetchPinMessages(chatId: string) {
    const { data } = await httpService.get(`/pinned-messages/chat/${chatId}`);
    return data;
}

export async function fetchCreatePinMessage(chatId: string, messageId: string) {
    const { data } = await httpService.post(`/pinned-messages/chat/${chatId}`, { messageId });
    return data;
}

export async function fetchDeletePinnedMessage(chatId: string, messageId: string) {
    const { data } = await httpService.delete(`/pinned-messages/chat/${chatId}/${messageId}`);
    return data;
}

export async function fetchUnpinAllMessages(chatId: string) {
    const { data } = await httpService.delete(`/pinned-messages/chat/${chatId}`);
    return data;
}
