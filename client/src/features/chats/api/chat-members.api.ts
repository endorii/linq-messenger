import { ServerResponseWithMessage } from "@/features/auth/interfaces/auth.interfaces";
import { httpService } from "@/shared/api/httpService";
import { IChat } from "@/shared/interfaces/IChat";
import { IChatMember } from "@/shared/interfaces/IChatMember";

export async function fetchToggleMarkChat(
    chatId: string,
    updateChatMemberPayload: Partial<IChatMember>
): Promise<ServerResponseWithMessage<IChat>> {
    const { data } = await httpService.patch(
        `/chat-members/mark/${chatId}`,
        updateChatMemberPayload
    );
    return data;
}

export async function fetchToggleMuteChat(
    chatId: string,
    updateChatMemberPayload: Partial<IChatMember>
): Promise<ServerResponseWithMessage<IChat>> {
    const { data } = await httpService.patch(
        `/chat-members/mute/${chatId}`,
        updateChatMemberPayload
    );
    return data;
}

export async function fetchAddMembersToChat(
    chatId: string,
    newMembers: string[]
): Promise<ServerResponseWithMessage> {
    const { data } = await httpService.post(`/chat-members/${chatId}`, { memberIds: newMembers });
    return data;
}
