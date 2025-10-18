import { httpService } from "@/shared/api/httpService";

export async function fetchTogglePinMessage(chatId: string, messageId: string) {
    const { data } = await httpService.post(`/pinned-messages/chat/${chatId}`, { messageId });
    return data;
}
