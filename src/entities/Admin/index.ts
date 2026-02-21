export type {
    AdminSchema, AdminOrganizationsFields,
    GetAdminSkillsParams,
    GetAdminAchievementsParams,
    AdminUser,
    GetAdminOrganizationParams,
    UpdateAdminUser,
    AdminUserFields,
    AdminOrganization,
    UpdateAdminOrganization,
    AdminReviewVacancySort,
    AdminReviewVolunteerSort,
    AdminVacancyWhere,
    AdminVacancyWhen,
    AdminVacancyWhoNeeds,
    UpdateAdminVacancyWhere,
    UpdateAdminVacancyWhen,
    UpdateAdminVacancyWhoNeeds,
    UpdateAdminVacancyConditions,
    UpdateAdminVacancyDescription,
    UpdateAdminVacancyFinishingTouches,
    GetAdminUsersResponse,
} from "./model/types/adminSchema";

export { AdminSort } from "./model/types/adminSchema";

export { adminReducer, adminActions } from "./model/slice/adminSlice";

export { getAdminAuthData } from "./model/selectors/adminSelectors";

export {
    adminUsersAdapter, adminUserAdapter, adminUpdateUserAdapter,
    adminOrganizationAdapter, adminOrganizationApiAdapter,
    adminOrganizationsAdapter, adminUserApiAdapter,
} from "./lib/adminAdapters";

export { UserInfoTable } from "./ui/UserInfoTable/UserInfoTable";

export { OrganizationInfoTable } from "./ui/OrganizationInfoTable/OrganizationInfoTable";

export { ReviewVacancyInfoTable } from "./ui/ReviewVacancyInfoTable/ReviewVacancyInfoTable";

export type { ReviewVacancy } from "./ui/ReviewVacancyInfoTable/ReviewVacancyInfoTable";

export { ReviewVolunteerInfoTable } from "./ui/ReviewVolunteerInfoTable/ReviewVolunteerInfoTable";

export type { ReviewVolunteer } from "./ui/ReviewVolunteerInfoTable/ReviewVolunteerInfoTable";

export {
    offerWhereApiAdapter, offerWhenFormAdapter,
    offerWhenFormApiAdapter,
    offerWhoNeedsAdapter,
    offerWhoNeedsApiAdapter,
    offerDescriptionAdapter,
    offerDescriptionApiAdapter,
    offerWhatToDoAdapter,
    offerWhatToDoApiAdapter,
    offerConditionsAdapter,
    offerConditionsApiAdapter,
    offerFinishingTouchesAdapter,
    offerFinishingTouchesApiAdapter,
} from "./lib/adminOfferAdapter";

export {
    adminApi, useCreateSkillMutation,
    useDeleteSkillMutation, useEditSkillMutation, useLazyGetSkillsQuery,
    useGetSkillByIdQuery, useGetSkillsQuery, useLazyGetSkillByIdQuery,
    useAddAdminRoleToUserMutation, useLazySearchUserByParamsQuery,
    useEditAdminReviewVacancyMutation, useDeleteAdminReviewVacancyMutation,
    useGetAdminReviewVacanciesListQuery, useGetAdminReviewVacancyByIdQuery,
    useLazyGetAdminReviewVacanciesListQuery, useLazyGetAdminReviewVacancyByIdQuery,
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
    useLazyGetTransfersQuery, useGetPublicFoodsQuery,
    useLazyGetUsersQuery,
    useUpdateAdminUserMutation,
    useDeleteUserMutation,
    useToggleAdminUserActiveMutation,
    useGetUserByIdQuery,
    useUpdateAdminOrganizationMutation,
    useToggleAdminOrganizationActiveMutation,
    useDeleteOrganizationMutation,
    useLazyGetOrganizationsQuery,
    useGetOrganizationByIdQuery,
    useGetPublicAchievementsQuery, useGetPublicCategoriesVacancyQuery,
    useGetPublicSkillsQuery,
    useGetPublicHousesQuery,
    useGetPublicTransfersQuery,
    useEditAdminReviewVolunteerMutation,
    useDeleteAdminReviewVolunteerMutation,
    useLazyGetAdminReviewVolunteerListQuery,
    useLazyGetAdminReviewVolunteerByIdQuery,
    useGetAdminReviewVolunteerByIdQuery,
    useLazyGetAdminOffersQuery,
    useDeleteAdminOfferMutation,
    useGetAdminVacancyWhereQuery,
    useUpdateAdminVacancyWhereMutation,
    useGetAdminVacancyWhenQuery,
    useUpdateAdminVacancyWhenMutation,
    useGetAdminVacancyWhoNeedsQuery,
    useUpdateAdminVacancyWhoNeedsMutation,
    useGetAdminVacancyConditionsQuery,
    useUpdateAdminVacancyConditionsMutation,
    useGetAdminVacancyDescriptionQuery,
    useUpdateAdminVacancyDescriptionMutation,
    useGetAdminVacancyWhatToDoQuery,
    useGetAdminVacancyFinishingTouchesQuery,
    useUpdateAdminVacancyWhatToDoMutation,
    useUpdateAdminVacancyFinishingTouchesMutation,
    useGetGoodsurfingTodayQuery,
    useUpdateAdminVacancyImageGalleryMutation,
    useUpdateAdminVacancyStatusMutation,
    useLazyGetAdminSearchUsersQuery,
} from "./api/adminApi";

export {
    adminCourseApi,
    useLazyGetAdminCoursesQuery,
    useGetAdminCourseByIdQuery,
    useCreateAdminCourseMutation,
    useUpdateAdminCourseMutation,
    useDeleteAdminCourseMutation,
    useLazyGetAdminReviewsCoursesQuery,
    useGetAdminReviewLessonByIdQuery,
    useUpdateAdminReviewLessonMutation,
    useDeleteAdminReviewLessonMutation,
    useLazyGetAdminCourseLessonsQuery,
    useGetAdminCourseLessonQuery,
    useCreateAdminCourseLessonMutation,
    useUpdateAdminCourseLessonMutation,
    useDeleteAdminCourseLessonMutation,
    useLazyGetCourseExpertsQuery,
    useGetCourseExpertByIdQuery,
    useCreateAdminExpertMutation,
    useGetCourseExpertsQuery,
    useUpdateAdminExpertMutation,
    useDeleteAdminExpertMutation,
    useCreateAdminExpertUserMutation,
    useUpdateAdminExpertUserMutation,
} from "./api/adminCourseApi";

export type {
    AdminCourseFields, AdminCourseAuthorFileds, AdminExpertFields, AdminLessonsFields,
    GetAdminCourse, CreateAdminLesson, CreateAdminExpert,
    GetAdminReviewCourse, GetAdminCourseLessons, AdminLessonFields,
    GetAdminReviewsLesson,
} from "./model/types/adminCourseSchema";

export {
    adminCourseAdapter, adminCreateCourseApiAdapter,
    adminCourseLessonsAdapter,
} from "./lib/adminCourseAdapter";

export { ReviewCourseInfoTable } from "./ui/ReviewCourseInfoTable/ReviewCourseInfoTable";

// News

export {
    adminNewsApi,
    useLazyGetAdminNewsListQuery,
    useGetAdminNewsByIdQuery,
    useCreateAdminNewsMutation,
    useUpdateAdminNewsMutation,
    useDeleteAdminNewsMutation,
    useLazyGetAdminReviewsNewsQuery,
    useGetAdminReviewNewsByIdQuery,
    useUpdateAdminReviewNewsMutation,
    useDeleteAdminReviewNewsMutation,
} from "./api/adminNewsApi";

export { newsAdapter, newsApiAdapter } from "./lib/adminNewsAdapter";

export type { GetAdminReviewsNews, GetAdminReviewNews } from "./model/types/adminNewsSchema";

export { ReviewNewsInfoTable } from "./ui/ReviewNewsInfoTable/ReviewNewsInfoTable";

// Blog

export {
    adminBlogApi,
    useLazyGetAdminBlogListQuery,
    useGetAdminBlogByIdQuery,
    useUpdateAdminBlogMutation,
    useDeleteAdminBlogMutation,
    useLazyGetAdminBlogCategoriesQuery,
    useGetAdminBlogCategoryByIdQuery,
    useCreateAdminBlogCategoryMutation,
    useUpdateAdminBlogCategoryMutation,
    useDeleteAdminBlogCategoryMutation,
    useLazyGetAdminReviewsBlogQuery,
    useGetAdminReviewBlogByIdQuery,
    useUpdateAdminReviewBlogMutation,
    useDeleteAdminReviewBlogMutation,
} from "./api/adminBlogApi";

export type {
    UpdateAdminBlog, GetAdminBlog, GetAdminBlogList,
    GetAdminBlogCategory, CreateBlogCategory,
    GetAdminReviewsBlog, GetAdminReviewBlog, UpdateAdminReviewBlog,
} from "./model/types/adminBlogSchema";

export { blogAdapter, blogApiAdapter } from "./lib/adminBlogAdapter";
