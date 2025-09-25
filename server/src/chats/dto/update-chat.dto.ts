import { PartialType } from "@nestjs/mapped-types";
import { CreateChannelDto, CreateGroupChatDto, CreatePrivateChatDto } from "./create-chat.dto";

export class UpdatePrivateChatDto extends PartialType(CreatePrivateChatDto) {}
export class UpdateGroupChatDto extends PartialType(CreateGroupChatDto) {}
export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
