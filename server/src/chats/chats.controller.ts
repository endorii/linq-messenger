import { Controller, Post, Body, UseGuards, Req, Get } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { CreatePrivateChatDto } from "./dto/create-chat.dto";

@Controller("chats")
@UseGuards(JwtAuthGuard)
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {}

    @Get()
    getUserChats(@Req() req: AuthenticatedRequest) {
        return this.chatsService.getUserChats(req.user.id);
    }

    @Post("private")
    createPrivate(@Req() req: AuthenticatedRequest, @Body() dto: CreatePrivateChatDto) {
        return this.chatsService.createPrivateChat(req.user.id, dto);
    }
}
