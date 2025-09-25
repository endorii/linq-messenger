import { Controller, Get, UseGuards, Req, Post, Body } from "@nestjs/common";
import { FoldersService } from "./folders.service";
// import { CreateFolderDto } from "./dto/create-folder.dto";
// import { UpdateFolderDto } from "./dto/update-folder.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { CreateFolderDto } from "./dto/create-folder.dto";

@Controller("folders")
@UseGuards(JwtAuthGuard)
export class FoldersController {
    constructor(private readonly foldersService: FoldersService) {}

    @Get()
    getAllUserFolders(@Req() req: AuthenticatedRequest) {
        return this.foldersService.getAllUserFolders(req.user.id);
    }

    @Post()
    createFolder(@Req() req: AuthenticatedRequest, @Body() createFolderDto: CreateFolderDto) {
        return this.foldersService.createFolder(req.user.id, createFolderDto);
    }
}
