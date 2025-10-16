import { Module } from "@nestjs/common";
import { UserBlocksService } from "./user-blocks.service";
import { UserBlocksController } from "./user-blocks.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [UserBlocksController],
    providers: [UserBlocksService],
})
export class UserBlocksModule {}
