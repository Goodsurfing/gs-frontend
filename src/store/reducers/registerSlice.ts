import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IRegisterResponse } from "@/type/auth/auth.interface";

const initialState: IRegisterResponse = {
    id: "",
    email: "",
};

export const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        setRegisterUserData: (
            state: IRegisterResponse,
            action: PayloadAction<IRegisterResponse>,
        ) => {
            return {
                id: action.payload.id,
                email: action.payload.email,
            };
        },
    },
});

export const { setRegisterUserData } = registerSlice.actions;
export default registerSlice.reducer;
