import { httpService } from "./httpService";

export async function fetchUploadChatFiles(files: File[], messageId: string) {
    const formData = new FormData();

    files.forEach((file) => formData.append("files", file));
    formData.append("messageId", messageId);

    const { data } = await httpService.post("/files/upload", formData);
    return data;
}
