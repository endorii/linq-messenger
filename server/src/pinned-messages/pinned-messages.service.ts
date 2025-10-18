import { Injectable } from "@nestjs/common";
import { CreatePinnedMessageDto } from "./dto/create-pinned-message.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PinnedMessagesService {
    constructor(private readonly prisma: PrismaService) {}
    async togglePinMessage(
        userId: string,
        chatId: string,
        createPinnedMessageDto: CreatePinnedMessageDto
    ) {
        const pinnedMessage = await this.prisma.pinnedMessage.findFirst({
            where: {
                userId,
                chatId,
                messageId: createPinnedMessageDto.messageId,
            },
        });

        if (pinnedMessage) {
            await this.prisma.pinnedMessage.delete({
                where: { id: pinnedMessage.id },
            });
            return { message: "Message unpinned successfully" };
        }

        await this.prisma.pinnedMessage.create({
            data: {
                userId,
                chatId,
                messageId: createPinnedMessageDto.messageId,
            },
        });

        return { message: "Message pinned successfully" };
    }
}
