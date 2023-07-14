import { createSlice } from "@reduxjs/toolkit";
import { LoginSchema } from "../types/loginSchema";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";

const initialState: LoginSchema = {
    token: localStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || undefined,
};

export const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        setAuthData: (state, action) => {
            state.token = action.payload;
        },
    },
});

export const {
    actions: loginActions,
    reducer: loginReducers,
} = loginSlice;
