import { Controller, Post, Body, UseGuards, Req, Get, Param, Delete } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { CreateChannelDto, CreateGroupChatDto, CreatePrivateChatDto } from "./dto/create-chat.dto";
import { MessagesService } from "src/messages/messages.service";
import { CreateMessageDto } from "src/messages/dto/create-message.dto";

@Controller("chats")
@UseGuards(JwtAuthGuard)
export class ChatsController {
    constructor(
        private readonly chatsService: ChatsService,
        private readonly messagesService: MessagesService
    ) {}

    @Get()
    getChats(@Req() req: AuthenticatedRequest) {
        return this.chatsService.getChats(req.user.id);
    }

    @Get(":chatId")
    async getChat(@Req() req: AuthenticatedRequest, @Param("chatId") chatId: string) {
        return this.chatsService.getChat(req.user.id, chatId);
    }

    @Post("private")
    createPrivateChat(
        @Req() req: AuthenticatedRequest,
        @Body() createPrivateChatDto: CreatePrivateChatDto
    ) {
        return this.chatsService.createPrivateChat(req.user.id, createPrivateChatDto);
    }

    @Post("group")
    createGroupChat(
        @Req() req: AuthenticatedRequest,
        @Body() createGroupChatDto: CreateGroupChatDto
    ) {
        return this.chatsService.createGroupChat(req.user.id, createGroupChatDto);
    }

    @Post("channel")
    createChannel(@Req() req: AuthenticatedRequest, @Body() createChannelDto: CreateChannelDto) {
        console.log("req.user:", req.user);
        console.log("typeof req.user.id:", typeof req.user.id);

        return this.chatsService.createChannel(req.user.id, createChannelDto);
    }

    @Delete(":chatId")
    deleteChat(@Req() req: AuthenticatedRequest, @Param("chatId") chatId: string) {
        return this.chatsService.deleteChat(req.user.id, chatId);
    }

    @Get(":chatId/messages")
    getChatMessages(@Req() req: AuthenticatedRequest, @Param("chatId") chatId: string) {
        return this.messagesService.getChatMessages(req.user.id, chatId);
    }

    @Post(":chatId/messages")
    postMessage(
        @Req() req: AuthenticatedRequest,
        @Param("chatId") chatId: string,
        @Body() createMessageDto: CreateMessageDto
    ) {
        return this.messagesService.postMessage(req.user.id, chatId, createMessageDto);
    }
}
