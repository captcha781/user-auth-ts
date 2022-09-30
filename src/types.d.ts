export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    username: string;
    profilePic: string;
    __v: number;
}

export interface InitialState {
    auth: boolean;
    user: null | User;
    token ?: string
}
