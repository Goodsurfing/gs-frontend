import { RootState } from "@/store/store";

export const getGalleryImages = (state: RootState) => {
    return state.gallery.galleryData?.images;
};
