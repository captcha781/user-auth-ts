import CredentialReducer from "./CredentialSlice";
import { configureStore } from "@reduxjs/toolkit";

const Store = configureStore({
    reducer:{
        credentials:CredentialReducer
    }
})

export default Store
export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch