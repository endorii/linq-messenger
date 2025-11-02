import { Request } from "express";
import { GoogleUser } from "./google-user.interface";
export interface GoogleAuthRequest extends Request {
    user: GoogleUser;
}
