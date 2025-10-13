import { ServerResponseWithMessage } from "@/features/auth/interfaces/auth.interfaces";
import { httpService } from "@/shared/api/httpService";
import { FolderPayload, IFolder } from "@/shared/interfaces/IFolder";

export async function fetchAllUserFolders(): Promise<IFolder[]> {
    const { data } = await httpService.get("/folders");
    return data;
}

export async function fetchAddChatFolder(
    folderPayload: FolderPayload
): Promise<ServerResponseWithMessage<IFolder>> {
    const { data } = await httpService.post("/folders", folderPayload);
    return data;
}
export async function fetchUpdateChatFolder(
    folderId: string,
    folderPayload: Partial<FolderPayload>
): Promise<ServerResponseWithMessage<IFolder>> {
    const { data } = await httpService.patch(`/folders/${folderId}`, folderPayload);
    return data;
}

export async function fetchDeleteChatFolder(
    folderId: string
): Promise<ServerResponseWithMessage<IFolder>> {
    const { data } = await httpService.delete(`/folders/${folderId}`);
    return data;
}

export async function fetchAddChatToFolder(
    chatId: string,
    folderId: string
): Promise<ServerResponseWithMessage> {
    const { data } = await httpService.post(`/folders/${folderId}/chats`, { chatId });
    return data;
}

export async function removeChatFromFolder(
    chatId: string,
    folderId: string
): Promise<ServerResponseWithMessage> {
    const { data } = await httpService.delete(`/folders/${folderId}/chats/${chatId}`);
    return data;
}
