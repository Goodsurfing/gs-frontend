import { ILoginResponse } from "@/type/auth/auth.interface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: ILoginResponse = {
    token: localStorage.getItem("token") || "",
};

export const loginSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        setLoginUserData: (
            state: ILoginResponse,
            action: PayloadAction<ILoginResponse>
        ) => {
            return {
                token: action.payload.token,
            };
        },
        logout: () => {
            return {
                token: "",
            };
        },
    },
});

export const { setLoginUserData } = loginSlice.actions;
export default loginSlice.reducer;
