import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { PrivacyService } from "./privacy.service";
import { UpdatePrivacyDto } from "./dto/update-privacy.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";

@Controller("privacy")
@UseGuards(JwtAuthGuard)
export class PrivacyController {
    constructor(private readonly privacyService: PrivacyService) {}

    @Get()
    getSettings(@Req() req: AuthenticatedRequest) {
        return this.privacyService.getSettings(req.user.id);
    }

    @Patch()
    updateSettings(@Req() req: AuthenticatedRequest, @Body() dto: UpdatePrivacyDto) {
        return this.privacyService.updateSettings(req.user.id, dto);
    }
}
