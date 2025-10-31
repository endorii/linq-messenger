import { IsOptional, IsIn } from "class-validator";

export class ChatAttachmentsDto {
    @IsOptional()
    @IsIn(["media", "files", "voice"])
    type?: "media" | "files" | "voice";
}
