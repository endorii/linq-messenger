import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdatePrivacyDto } from "./dto/update-privacy.dto";

@Injectable()
export class PrivacyService {
    constructor(private prisma: PrismaService) {}

    async getSettings(userId: string) {
        const settings = await this.prisma.privacySettings.findUnique({
            where: { userId },
        });

        if (!settings) {
            await this.prisma.privacySettings.create({
                data: { userId },
            });
        }

        return settings;
    }

    async updateSettings(userId: string, dto: UpdatePrivacyDto) {
        return this.prisma.privacySettings.update({
            where: { userId },
            data: dto,
        });
    }
}
