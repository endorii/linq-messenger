import { IsNotEmpty, IsOptional, IsString, IsEnum } from "class-validator";

export enum MessageType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    SYSTEM = "SYSTEM",
}

export class CreateMessageDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsEnum(MessageType)
    type?: MessageType = MessageType.TEXT;

    @IsOptional()
    @IsString()
    replyToId?: string;
}
