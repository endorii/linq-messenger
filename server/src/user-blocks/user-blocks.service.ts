import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserBlockDto } from "./dto/create-user-block.dto";

@Injectable()
export class UserBlocksService {
    constructor(private readonly prisma: PrismaService) {}

    async toggleBlockUser(userId: string, createUserBlockDto: CreateUserBlockDto) {
        const blockedId = createUserBlockDto.userIdBlock;

        if (userId === blockedId) {
            throw new BadRequestException("You cannot block yourself");
        }

        const userExists = await this.prisma.user.findUnique({
            where: { id: blockedId },
            select: { id: true },
        });

        if (!userExists) {
            throw new BadRequestException("User not found");
        }

        const existingBlock = await this.prisma.userBlock.findUnique({
            where: {
                blockerId_blockedId: { blockerId: userId, blockedId },
            },
        });

        if (!existingBlock) {
            await this.prisma.userBlock.create({
                data: { blockerId: userId, blockedId },
            });

            return {
                message: "User successfully blocked",
                data: {
                    isBlocked: true,
                },
            };
        }

        await this.prisma.userBlock.delete({
            where: {
                blockerId_blockedId: { blockerId: userId, blockedId },
            },
        });

        return {
            message: "User unblocked",
            data: {
                isBlocked: false,
            },
        };
    }
}
