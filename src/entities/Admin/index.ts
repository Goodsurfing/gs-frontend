export type { AdminSchema, AdminOrganizationsFields, AdminUsersFields } from "./model/types/adminSchema";

export { adminReducer, adminActions } from "./model/slice/adminSlice";

export { getAdminAuthData } from "./model/selectors/adminSelectors";

export { adminUsersAdapter, adminOrganizationsAdapter } from "./lib/adminAdapters";

export { UserInfoTable } from "./ui/UserInfoTable/UserInfoTable";

export { OrganizationInfoTable } from "./ui/OrganizationInfoTable/OrganizationInfoTable";

export {
    adminApi, useCreateSkillMutation,
    useDeleteSkillMutation, useEditSkillMutation, useLazyGetSkillsQuery,
    useGetSkillByIdQuery, useGetSkillsQuery, useLazyGetSkillByIdQuery,
    useAddAdminRoleToUserMutation, useLazySearchUserByParamsQuery,
    useEditReviewVacancyMutation, useDeleteReviewVacancyMutation,
    useGetReviewVacanciesListQuery, useGetReviewVacancyByIdQuery,
    useLazyGetReviewVacanciesListQuery, useLazyGetReviewVacancyByIdQuery,
    useCreateCategoryVacancyMutation, useDeleteCategoryVacancyMutation,
    useEditCategoryVacancyMutation, useGetCategoryVacancyByIdQuery,
    useLazyGetCategoriesVacancyQuery,
} from "./api/adminApi";
