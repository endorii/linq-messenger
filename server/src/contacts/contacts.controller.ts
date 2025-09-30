import { Controller, Get, Post, Body, UseGuards, Req, Delete, Param } from "@nestjs/common";
import { ContactsService } from "./contacts.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";

@Controller("contacts")
@UseGuards(JwtAuthGuard)
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}

    @Get()
    getAllContacts(@Req() req: AuthenticatedRequest) {
        return this.contactsService.getAllContacts(req.user.id);
    }

    @Post()
    addContact(@Req() req: AuthenticatedRequest, @Body() createContactDto: CreateContactDto) {
        return this.contactsService.addContact(req.user.id, createContactDto);
    }

    @Delete(":contactId")
    deleteContact(@Req() req: AuthenticatedRequest, @Param("contactId") contactId: string) {
        return this.contactsService.deleteContact(req.user.id, contactId);
    }
}
