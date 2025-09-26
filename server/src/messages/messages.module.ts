import { Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { ChatsService } from "src/chats/chats.service";

@Module({
    controllers: [MessagesController],
    providers: [MessagesService, PrismaService, ChatsService],
})
export class MessagesModule {}
