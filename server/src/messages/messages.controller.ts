import { Body, Controller, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("messages")
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Patch(":messageId")
    updateMessage(
        @Req() req: AuthenticatedRequest,
        @Param("messageId") messageId: string,
        @Body() updateMessageDto: UpdateMessageDto
    ) {
        return this.messagesService.updateMessage(req.user.id, messageId, updateMessageDto);
    }

    @Post(":messageId/deleteForMe")
    deleteMessageForMe(@Req() req: AuthenticatedRequest, @Param("messageId") messageId: string) {
        return this.messagesService.deleteMessageForMe(req.user.id, messageId);
    }
    @Patch(":messageId/delete")
    deleteMessage(@Req() req: AuthenticatedRequest, @Param("messageId") messageId: string) {
        return this.messagesService.deleteMessage(req.user.id, messageId);
    }
}
