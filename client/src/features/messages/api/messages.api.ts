import { httpService } from "@/shared/api/httpService";
import { IMessage } from "@/shared/interfaces/IMessage";

export async function fetchMessages(chatId: string): Promise<IMessage[]> {
    const { data } = await httpService.get(`/chats/${chatId}/messages`);
    return data;
}
