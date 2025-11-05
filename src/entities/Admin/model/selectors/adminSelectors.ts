import { RootState } from "@/store/store";

export const getAdminAuthData = (state: RootState) => state.admin.authData;
