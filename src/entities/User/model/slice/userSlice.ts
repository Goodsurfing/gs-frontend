import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TOKEN_LOCALSTORAGE_KEY, USER_LOCALSTORAGE_KEY, MERCURE_TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";
import { User, UserSchema } from "../types/userSchema";

const initialState: UserSchema = {
    _inited: false,
    authData: undefined,
};

export const userSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<User>) => {
            state.authData = action.payload;
        },
        initAuthData: (state) => {
            const user = localStorage.getItem(USER_LOCALSTORAGE_KEY);
            if (user) {
                state.authData = JSON.parse(user);
            }
            state._inited = true;
        },
        logout: (state) => {
            state.authData = undefined;
            localStorage.removeItem(USER_LOCALSTORAGE_KEY);
            localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY);
            localStorage.removeItem(MERCURE_TOKEN_LOCALSTORAGE_KEY);
        },
    },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;
