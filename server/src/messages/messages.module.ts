import { Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { ChatMembersModule } from "src/chat-members/chat-members.module";
import { FilesModule } from "src/files/files.module";

@Module({
    imports: [ChatMembersModule, FilesModule],
    controllers: [MessagesController],
    providers: [MessagesService, PrismaService],
})
export class MessagesModule {}
