export interface JwtPayload {
    id: string;
    username: string;
    email: string;
    exp?: number;
}
