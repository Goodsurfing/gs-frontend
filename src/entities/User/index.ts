export type { User, UserSchema } from "./model/types/user";
export { userActions, userReducer } from "./model/slice/userSlice";
export { userInfoApi } from "./model/services/userInfoApi";
export { getUserAuthData } from "./model/selectors/getUserAuthData/getUserAuthData";
