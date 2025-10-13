import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { CreateChatDto, CreatePrivateChatDto } from "./dto/create-chat.dto";
import { MessagesService } from "src/messages/messages.service";
import { CreateMessageDto } from "src/messages/dto/create-message.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";

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

    @Get("folder/:folderId")
    async getChatsByFolder(@Req() req: AuthenticatedRequest, @Param("folderId") folderId: string) {
        return this.chatsService.getChatsByFolder(req.user.id, folderId);
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

    @Post("chat")
    createChat(@Req() req: AuthenticatedRequest, @Body() createChatDto: CreateChatDto) {
        return this.chatsService.createChat(req.user.id, createChatDto);
    }

    @Patch(":chatId")
    updateChat(
        @Req() req: AuthenticatedRequest,
        @Param("chatId") chatId: string,
        @Body() updateChatDto: UpdateChatDto
    ) {
        return this.chatsService.updateChat(req.user.id, chatId, updateChatDto);
    }

    @Post(":chatId/leave")
    leaveChat(@Req() req: AuthenticatedRequest, @Param("chatId") chatId: string) {
        return this.chatsService.leaveChat(req.user.id, chatId);
    }

    @Patch(":chatId/delete")
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
