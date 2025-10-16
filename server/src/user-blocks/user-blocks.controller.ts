import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { UserBlocksService } from "./user-blocks.service";
import { CreateUserBlockDto } from "./dto/create-user-block.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";

@Controller("user-blocks")
@UseGuards(JwtAuthGuard)
export class UserBlocksController {
    constructor(private readonly userBlocksService: UserBlocksService) {}

    @Post()
    toggleBlockUser(
        @Req() req: AuthenticatedRequest,
        @Body() createUserBlockDto: CreateUserBlockDto
    ) {
        return this.userBlocksService.toggleBlockUser(req.user.id, createUserBlockDto);
    }
}
