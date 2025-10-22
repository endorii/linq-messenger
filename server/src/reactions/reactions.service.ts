import { Injectable } from "@nestjs/common";
import { CreateReactionDto } from "./dto/create-reaction.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ReactionsService {
    constructor(private prisma: PrismaService) {}

    async toggleReaction(userId: string, dto: CreateReactionDto) {
        const { messageId, emoji } = dto;

        const existing = await this.prisma.messageReaction.findUnique({
            where: {
                userId_messageId: { userId, messageId },
            },
        });

        if (existing && existing.emoji === emoji) {
            await this.prisma.messageReaction.delete({ where: { id: existing.id } });
            return { removed: true, emoji };
        }

        if (existing) {
            await this.prisma.messageReaction.update({
                where: { id: existing.id },
                data: { emoji },
            });
            return { changed: true, emoji };
        }

        await this.prisma.messageReaction.create({
            data: { userId, messageId, emoji },
        });

        return { added: true, emoji };
    }
}
