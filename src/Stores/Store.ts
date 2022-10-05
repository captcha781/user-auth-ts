import CredentialReducer from "./CredentialSlice";
import { configureStore } from "@reduxjs/toolkit";
import PostReducer from "./PostSlice";

const Store = configureStore({
    reducer:{
        credentials:CredentialReducer,
        posts: PostReducer
    },
})

export default Store
export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch