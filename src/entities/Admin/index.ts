export type {
    AdminSchema, AdminOrganizationsFields,
    GetAdminSkillsParams,
    GetAdminAchievementsParams,
} from "./model/types/adminSchema";

export { AdminSort } from "./model/types/adminSchema";

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
    useCreateAchievementMutation, useCreateFoodMutation,
    useCreateHouseMutation, useCreateTransferMutation,
    useDeleteAchievementMutation, useDeleteFoodMutation,
    useDeleteHouseMutation, useDeleteTransferMutation,
    useEditAchievementMutation, useEditFoodMutation,
    useEditHouseMutation, useEditTransferMutation,
    useGetAchievementByIdQuery, useGetAchievementsQuery,
    useGetFoodByIdQuery, useGetFoodsQuery,
    useGetHouseByIdQuery, useGetHousesQuery,
    useGetTransfersQuery, useGetTransfertByIdQuery,
    useLazyGetAchievementsQuery,
    useLazyGetFoodsQuery, useLazyGetHousesQuery,
    useLazyGetTransfersQuery,
    useLazyGetUsersQuery,
    useUpdateAdminUserMutation,
    useDeleteUserMutation,
    useToggleAdminUserActiveMutation,
} from "./api/adminApi";
