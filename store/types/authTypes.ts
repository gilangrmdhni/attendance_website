export interface Position {
    name: string;
    description: string;
}

export interface User {
    id: number;
    email: string;
    full_name: string;
    phone_number: string;
    status: string;
    join_date: string;
    type: string;
    picture: string;
    position: Position;
    role: string;
    nip: number;
}

export interface AuthState {
    token: string | null;
    user: User | null;
    loading: boolean;
    error: string | null;
}

export interface LoginResponse {
    [x: string]: any;
    body: User;
    metadata: [
        {
            token_type: string;
            token_string: string;
        }
    ];
    code: number;
    error: string | null;
    message: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}
