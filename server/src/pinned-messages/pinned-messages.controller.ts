import { Controller, Post, Body, Param, Req, UseGuards, Get, Delete } from "@nestjs/common";
import { PinnedMessagesService } from "./pinned-messages.service";
import { CreatePinnedMessageDto } from "./dto/create-pinned-message.dto";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("pinned-messages")
@UseGuards(JwtAuthGuard)
export class PinnedMessagesController {
    constructor(private readonly pinnedMessagesService: PinnedMessagesService) {}

    @Get("chat/:chatId")
    getPinnedMessages(@Param("chatId") chatId: string, @Req() req: AuthenticatedRequest) {
        return this.pinnedMessagesService.getPinnedMessages(req.user.id, chatId);
    }

    @Post("chat/:chatId")
    createPinMessage(
        @Req() req: AuthenticatedRequest,
        @Param("chatId") chatId: string,
        @Body() createPinnedMessageDto: CreatePinnedMessageDto
    ) {
        return this.pinnedMessagesService.createPinMessage(
            req.user.id,
            chatId,
            createPinnedMessageDto
        );
    }

    @Delete("chat/:chatId")
    unpinAllMessages(@Param("chatId") chatId: string) {
        return this.pinnedMessagesService.unpinAllMessages(chatId);
    }

    @Delete("chat/:chatId/:pinnedMessageId")
    deletePinnedMessage(
        @Param("chatId") chatId: string,
        @Param("pinnedMessageId") pinnedMessageId: string
    ) {
        return this.pinnedMessagesService.deletePinnedMessage(chatId, pinnedMessageId);
    }
}
