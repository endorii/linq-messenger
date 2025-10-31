import { ServerResponseWithMessage } from "@/features/auth/interfaces/auth.interfaces";
import { httpService } from "./httpService";

export async function fetchUploadChatFiles(files: File[], messageId: string) {
    const formData = new FormData();

    files.forEach((file) => formData.append("files", file));
    formData.append("messageId", messageId);

    const { data } = await httpService.post("/files/upload", formData);
    return data;
}

export async function fetchUploadAvatar(avatar: File): Promise<ServerResponseWithMessage> {
    const formData = new FormData();

    formData.append("avatar", avatar);

    const { data } = await httpService.post("/files/upload-avatar", formData);
    return data;
}

export async function fetchUploadChatAvatar(
    avatar: File,
    chatId: string
): Promise<ServerResponseWithMessage> {
    const formData = new FormData();

    formData.append("avatar", avatar);

    const { data } = await httpService.post(`/files/upload-chat-avatar/${chatId}`, formData);
    return data;
}
