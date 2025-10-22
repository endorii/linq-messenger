import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { ReactionsService } from "./reactions.service";
import { CreateReactionDto } from "./dto/create-reaction.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";

@Controller("reactions")
@UseGuards(JwtAuthGuard)
export class ReactionsController {
    constructor(private readonly reactionsService: ReactionsService) {}

    @Post()
    async toggleReaction(@Body() dto: CreateReactionDto, @Req() req: AuthenticatedRequest) {
        return this.reactionsService.toggleReaction(req.user.id, dto);
    }
}
