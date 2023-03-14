import { IUserResponse } from "@/types/api/user/user.interface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: IUserResponse = {
    image: null
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (
            state: IUserResponse,
            action: PayloadAction<IUserResponse>,
        ) => {
            return {
                image: action.payload.image,
            };
        }
    }
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;