import { Module } from "@nestjs/common";
import { PinnedMessagesService } from "./pinned-messages.service";
import { PinnedMessagesController } from "./pinned-messages.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [PinnedMessagesController],
    providers: [PinnedMessagesService],
})
export class PinnedMessagesModule {}
