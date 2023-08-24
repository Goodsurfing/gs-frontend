import type { RootState } from "@/store/store";

export const getProfileData = (state: RootState) => state.profile.data;

export const getProfileForm = (state: RootState) => state.profile.form;

export const getProfileReadonly = (state: RootState) => state.profile.readonly;
