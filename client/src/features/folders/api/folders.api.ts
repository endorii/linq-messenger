import { ServerResponseWithMessage } from "@/features/auth/interfaces/auth.interfaces";
import { httpService } from "@/shared/api/httpService";
import { FolderPayload, IChatFolder } from "@/shared/interfaces/IFolder";

export async function fetchAllUserFolders(): Promise<IChatFolder[]> {
    const { data } = await httpService.get("/folders");
    return data;
}

export async function fetchAddChatFolder(
    folderPayload: FolderPayload
): Promise<ServerResponseWithMessage<IChatFolder>> {
    const { data } = await httpService.post("/folders", folderPayload);
    return data;
}
