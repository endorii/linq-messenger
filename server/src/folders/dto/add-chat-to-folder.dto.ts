import { IsString, IsNotEmpty } from "class-validator";

export class AddChatToFolderDto {
    @IsString()
    @IsNotEmpty()
    chatId: string;
}
