import { Module } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { ChatsController } from "./chats.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { MessagesService } from "src/messages/messages.service";
import { ChatMembersModule } from "src/chat-members/chat-members.module";
import { FilesModule } from "src/files/files.module";

@Module({
    imports: [ChatMembersModule, FilesModule],
    controllers: [ChatsController],
    providers: [ChatsService, PrismaService, MessagesService],
})
export class ChatsModule {}
