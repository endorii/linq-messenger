import { Body, Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(":username")
    @UseGuards(JwtAuthGuard)
    findByUsername(@Param("username") username: string) {
        return this.userService.findUniqueUsername(username);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    editUserInfo(@Req() req: AuthenticatedRequest, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.editUserInfo(req.user.id, updateUserDto);
    }
}
