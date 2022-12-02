import { IAuthFormData } from "@/type/auth/auth.interface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: IAuthFormData = {
    email: "",
    password: "",
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (
            state: IAuthFormData,
            action: PayloadAction<IAuthFormData>
        ) => {
            return {
                email: action.payload.email,
                password: action.payload.password,
            };
        },
        logout: (state: IAuthFormData) => {
            return {
                email: "",
                password: "",
            };
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
