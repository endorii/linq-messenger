import { Controller, Get, Query, UseGuards, Req } from "@nestjs/common";
import { SearchService } from "./search.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";

@Controller("search")
@UseGuards(JwtAuthGuard)
export class SearchController {
    constructor(private searchService: SearchService) {}

    @Get()
    async globalSearch(@Query("q") query: string, @Req() req: AuthenticatedRequest) {
        return this.searchService.globalSearch(query, req.user.id);
    }
}
