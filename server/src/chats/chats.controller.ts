import { Controller, Post, Body, UseGuards, Req, Get, Param } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { CreatePrivateChatDto } from "./dto/create-chat.dto";
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

    @Post("private")
    createPrivateChat(@Req() req: AuthenticatedRequest, @Body() dto: CreatePrivateChatDto) {
        return this.chatsService.createPrivateChat(req.user.id, dto);
    }

    @Get(":chatId")
    getChat(@Req() req: AuthenticatedRequest, @Param("chatId") chatId: string) {
        return this.chatsService.getChat(req.user.id, chatId);
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
