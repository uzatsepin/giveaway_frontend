export interface AuthResponse {
    success: boolean;
    data?: {
        token: string;
        user: {
            id: number;
            username: string;
        }
        message?: string;
    };
    error?: string;
}

export interface ILoginForm {
    username: string;
    password: string;
}