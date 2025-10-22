export type { AdminSchema, AdminUsersFields } from "./model/types/adminSchema";

export { adminReducer, adminActions } from "./model/slice/adminSlice";

export { getAdminAuthData } from "./model/selectors/adminSelectors";

export { adminUsersAdapter } from "./lib/adminAdapters";

export { UserInfoTable } from "./ui/UserInfoTable/UserInfoTable";
