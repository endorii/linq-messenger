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
