import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Profile, ProfileSchema } from "../types/profile";

const initialState: ProfileSchema = {
    data: undefined,
    form: undefined,
    readonly: true,
};

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setReadonly: (state, action: PayloadAction<boolean>) => {
            state.readonly = action.payload;
        },
        cancelEdit: (state) => {
            state.readonly = true;
            state.form = state.data;
        },
        updateProfile: (state, action: PayloadAction<Profile>) => {
            state.form = {
                ...state.form,
                ...action.payload,
            };
        },
    },
});

export const { actions: profileActions } = profileSlice;
export const { reducer: profileReducer } = profileSlice;
