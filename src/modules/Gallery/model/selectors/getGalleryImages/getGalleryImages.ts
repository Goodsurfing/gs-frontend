import { RootState } from "@/store/store";

export const getGalleryImages = (state: RootState) => state.gallery.galleryData?.images;
