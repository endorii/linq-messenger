import { Body, Controller, Param, Patch, Req, UseGuards } from "@nestjs/common";
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
}
