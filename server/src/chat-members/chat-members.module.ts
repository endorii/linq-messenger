import { Module } from "@nestjs/common";
import { ChatMembersService } from "./chat-members.service";
import { ChatMembersController } from "./chat-members.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    controllers: [ChatMembersController],
    providers: [ChatMembersService, PrismaService],
    exports: [ChatMembersService],
})
export class ChatMembersModule {}
