export interface LoginUserDto {
    username: string;
    password: string;
}

export interface RegisterUserDto extends LoginUserDto {
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
}

export interface ServerResponseWithMessage<T = unknown> {
    message: string;
    data?: T;
}
