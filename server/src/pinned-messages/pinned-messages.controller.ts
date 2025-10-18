import { Controller, Post, Body, Param, Req, UseGuards } from "@nestjs/common";
import { PinnedMessagesService } from "./pinned-messages.service";
import { CreatePinnedMessageDto } from "./dto/create-pinned-message.dto";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("pinned-messages")
@UseGuards(JwtAuthGuard)
export class PinnedMessagesController {
    constructor(private readonly pinnedMessagesService: PinnedMessagesService) {}

    @Post("chat/:chatId")
    togglePinMessage(
        @Req() req: AuthenticatedRequest,
        @Param("chatId") chatId: string,
        @Body() createPinnedMessageDto: CreatePinnedMessageDto
    ) {
        return this.pinnedMessagesService.togglePinMessage(
            req.user.id,
            chatId,
            createPinnedMessageDto
        );
    }
}
