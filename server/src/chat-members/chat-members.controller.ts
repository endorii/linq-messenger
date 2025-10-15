import { Controller, Body, Patch, Param, Req, UseGuards, Post } from "@nestjs/common";
import { ChatMembersService } from "./chat-members.service";
// import { CreateChatMemberDto } from "./dto/create-chat-member.dto";
import { UpdateChatMemberDto } from "./dto/update-chat-member.dto";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AddNewMembersDto } from "./dto/add-new-members.dto";

@Controller("chat-members")
@UseGuards(JwtAuthGuard)
export class ChatMembersController {
    constructor(private readonly chatMembersService: ChatMembersService) {}

    @Patch("mark/:chatId")
    toggleMarkMember(
        @Param("chatId") chatId: string,
        @Req() req: AuthenticatedRequest,
        @Body() updateChatMemberDto: UpdateChatMemberDto
    ) {
        return this.chatMembersService.toggleMarkMember(req.user.id, chatId, updateChatMemberDto);
    }

    @Patch("mute/:chatId")
    toggleMuteMember(
        @Param("chatId") chatId: string,
        @Req() req: AuthenticatedRequest,
        @Body() updateChatMemberDto: UpdateChatMemberDto
    ) {
        return this.chatMembersService.toggleMuteMember(req.user.id, chatId, updateChatMemberDto);
    }

    @Post(":chatId")
    addMembersToChat(
        @Param("chatId") chatId: string,
        @Req() req: AuthenticatedRequest,
        @Body() addNewMembersDto: AddNewMembersDto
    ) {
        return this.chatMembersService.addMembersToChat(req.user.id, chatId, addNewMembersDto);
    }
}
