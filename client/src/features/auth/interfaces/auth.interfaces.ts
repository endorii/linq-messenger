export interface CreateUserDto {
    username: string;
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    password: string;
}

export interface ServerResponseWithMessage<T = unknown> {
    message: string;
    data?: T;
}
