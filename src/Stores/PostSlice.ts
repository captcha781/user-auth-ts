import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { Post, PostsInitialState } from "../types"

const initialState:PostsInitialState = {
    posts: []
}

export const postSlice = createSlice({
    initialState,
    name: "posts",
    reducers:{
        initializePosts: (state:PostsInitialState, action: PayloadAction<PostsInitialState>) => {
            state.posts = action.payload.posts
        },
        addPost: (state: PostsInitialState, action:PayloadAction<Post>) => {
            state.posts.splice(0,0,action.payload)
        },
        deletePost: (state: PostsInitialState, action:PayloadAction<string>) => {
            state.posts = state.posts.filter(post => post._id !== action.payload)
        },
        editPost: (state: PostsInitialState, action:PayloadAction<Post>) => {
            const index = state.posts.findIndex(post => post._id === action.payload._id)
            state.posts[index] = action.payload
        }
    }
})


export const {initializePosts, addPost, deletePost, editPost} = postSlice.actions
export default postSlice.reducer