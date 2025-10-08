import { PartialType } from "@nestjs/mapped-types";
import { CreateChatDto, CreatePrivateChatDto } from "./create-chat.dto";

export class UpdatePrivateChatDto extends PartialType(CreatePrivateChatDto) {}
export class UpdateChatDto extends PartialType(CreateChatDto) {}
