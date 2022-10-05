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

export interface Post {
    _id: string,
    title: string,
    content: string,
    postedBy: User,
    totalComments: number,
    comments: any,
    totalLikes: number,
    likes: any,
    postTime: string
}
export interface PostsInitialState {
    posts:Post[]
}