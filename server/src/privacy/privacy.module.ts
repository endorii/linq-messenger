import { Module } from "@nestjs/common";
import { PrivacyService } from "./privacy.service";
import { PrivacyController } from "./privacy.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [PrivacyController],
    providers: [PrivacyService],
})
export class PrivacyModule {}
