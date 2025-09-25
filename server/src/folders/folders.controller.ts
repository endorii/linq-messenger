import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { FoldersService } from "./folders.service";
// import { CreateFolderDto } from "./dto/create-folder.dto";
// import { UpdateFolderDto } from "./dto/update-folder.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";

@Controller("folders")
@UseGuards(JwtAuthGuard)
export class FoldersController {
    constructor(private readonly foldersService: FoldersService) {}

    @Get()
    getAllUserFolders(@Req() req: AuthenticatedRequest) {
        return this.foldersService.getAllUserFolders(req.user.id);
    }
}
