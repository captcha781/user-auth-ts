import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { InitialState } from "../types"

const CredentialSlice = createSlice({
    name:"Credentials",
    initialState:{
        auth: false,
        user: null
    } as InitialState ,
    reducers: {
        intialize : (state:InitialState, action:PayloadAction<InitialState>) => {
            state.auth = action.payload.auth
            state.user = action.payload.user
        },
        signout: (state:InitialState, action:any) => {
            state.auth = false
            state.user = null
        }
    }
})

export const {intialize,signout} = CredentialSlice.actions
export default CredentialSlice.reducer