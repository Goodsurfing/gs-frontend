import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Gallery, GallerySchema } from "../types/gallery";

const initialState: GallerySchema = {};

export const gallerySlice = createSlice({
    name: "gallery",
    initialState,
    reducers: {
        setImages: (state, action: PayloadAction<Gallery>) => {
            state.galleryData = action.payload;
        },
        addImage: (state, action: PayloadAction<string>) => {
            state.galleryData?.images.push(action.payload);
        },
        deleteImage: (state, action) => {
            state.galleryData?.images.filter((item) => item !== action.payload);
        },
    },
});

export const { reducer: galleryReducer } = gallerySlice;
export const { actions: galleryActions } = gallerySlice;
