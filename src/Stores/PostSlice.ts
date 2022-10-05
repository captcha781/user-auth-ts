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
        }
    }
})


export const {initializePosts, addPost} = postSlice.actions
export default postSlice.reducer