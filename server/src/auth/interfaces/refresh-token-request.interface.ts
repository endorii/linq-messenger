export interface RefreshTokenRequest extends Request {
    cookies: { refreshToken?: string };
}
