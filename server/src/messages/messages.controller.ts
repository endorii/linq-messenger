import { Body, Controller, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateForwardMessagesDto } from "./dto/create-forward-messages.dto";
import { CreateForwardMessageDto } from "./dto/create-forward-message.dto";

@Controller("messages")
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Patch("read")
    async markAsRead(@Req() req: AuthenticatedRequest, @Body() body: { messageIds: string[] }) {
        return this.messagesService.markAsRead(req.user.id, body.messageIds);
    }

    @Post("forward")
    async forwardMessage(
        @Req() req: AuthenticatedRequest,
        @Body() createForwardMessageDto: CreateForwardMessageDto
    ) {
        return this.messagesService.forwardMessage(req.user.id, createForwardMessageDto);
    }

    @Post("forwardMany")
    async forwardMessages(
        @Req() req: AuthenticatedRequest,
        @Body() createForwardMessagesDto: CreateForwardMessagesDto
    ) {
        return this.messagesService.forwardMessages(req.user.id, createForwardMessagesDto);
    }

    @Post("deleteForMe")
    deleteMessagesForMe(
        @Req() req: AuthenticatedRequest,
        @Body() { messageIds }: { messageIds: string[] }
    ) {
        return this.messagesService.deleteMessagesForMeMany(req.user.id, messageIds);
    }

    @Patch("delete")
    deleteMessages(
        @Req() req: AuthenticatedRequest,
        @Body() { messageIds }: { messageIds: string[] }
    ) {
        return this.messagesService.deleteMessagesMany(req.user.id, messageIds);
    }

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
