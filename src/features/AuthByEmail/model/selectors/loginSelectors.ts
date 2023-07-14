import { RootState } from "@/store/store";

export const getAuthToken = (state: RootState) => state.auth.token;
