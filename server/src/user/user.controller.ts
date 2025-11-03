import { Body, Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Patch()
    @UseGuards(JwtAuthGuard)
    editUserInfo(@Req() req: AuthenticatedRequest, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.editUserInfo(req.user.id, updateUserDto);
    }

    @Get(":username")
    @UseGuards(JwtAuthGuard)
    findByUsername(@Param("username") username: string) {
        return this.userService.findUniqueUsername(username);
    }
}
