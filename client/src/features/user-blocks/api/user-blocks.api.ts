import { ServerResponseWithMessage } from "@/features/auth/interfaces/auth.interfaces";
import { httpService } from "@/shared/api/httpService";
import { BlockUserPayload } from "@/shared/interfaces/IBlockedUser";

export async function fetchToggleBlockUser(
    blockUserPayload: BlockUserPayload
): Promise<ServerResponseWithMessage<{ isBlocked: boolean }>> {
    const { data } = await httpService.post(`/user-blocks`, blockUserPayload);
    return data;
}
