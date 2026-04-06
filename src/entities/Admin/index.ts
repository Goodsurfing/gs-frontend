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
    AdminAmbassadorsFields,
    GetAdminAmbassador,
} from "./model/types/adminSchema";

export { AdminSort } from "./model/types/adminSchema";

export { adminReducer, adminActions } from "./model/slice/adminSlice";

export { getAdminAuthData } from "./model/selectors/adminSelectors";

export {
    adminUsersAdapter, adminUserAdapter, adminUpdateUserAdapter,
    adminOrganizationAdapter, adminOrganizationApiAdapter,
    adminOrganizationsAdapter, adminUserApiAdapter,
    adminAmbassadorsAdapter, adminAmbassadorApiAdapter,
    adminAmbassadorAdapter,
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
    useGetAmbassadorsQuery,
    useLazyGetAdminAmbassadorsQuery,
    useGetAdminAmbassadorByIdQuery,
    useCreateAdminAmbassadorMutation,
    useUpdateAdminAmbassadorMutation,
    useDeleteAdminAmbassadorMutation,
    useGetAbouProjectPageInfoQuery,
    useGetAdminAbouProjectPageInfoQuery,
    useUpdateAdminAbouProjectPageInfoMutation,
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
    adminCourseExpertsAdapter,
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
    useCreateAdminBlogMutation,
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

export { ReviewBlogInfoTable } from "./ui/ReviewBlogInfoTable/ReviewBlogInfoTable";

// Journal

export {
    adminJournalApi,
    useLazyGetAdminJournalListQuery,
    useGetAdminJournalByIdQuery,
    useCreateAdminJournalMutation,
    useUpdateAdminJournalMutation,
    useDeleteAdminJournalMutation,
    useLazyGetAdminReviewsJournalQuery,
    useGetAdminReviewJournalByIdQuery,
    useUpdateAdminReviewJournalMutation,
    useDeleteAdminReviewJournalMutation,
} from "./api/adminJournalApi";

export type {
    GetAdminJournalsResponse, GetAdminJournal, CreateAdminJournal,
    GetAdminReviewsJournal, GetAdminReviewJournal,
} from "./model/types/adminJournalSchema";

export { ReviewJournalInfoTable } from "./ui/ReviewJournalInfoTable/ReviewJournalInfoTable";

// Video

export type {
    GetAdminReviewsVideo, GetAdminReviewVideo,
    GetAdminVideo, GetAdminVideos,
    UpdateAdminReviewVideo, UpdateAdminVideo,
    AdminVideoFileds, AdminVideoAuthorFileds,
} from "./model/types/adminVideoSchema";

export {
    adminVideoApi,
    useLazyGetAdminVideoListQuery,
    useLazyGetAdminVideoByIdQuery,
    useCreateAdminVideoMutation,
    useGetAdminVideoByIdQuery,
    useUpdateAdminVideoMutation,
    useDeleteAdminVideoMutation,
    useLazyGetAdminReviewsVideoQuery,
    useGetAdminReviewVideoByIdQuery,
    useUpdateAdminReviewVideoMutation,
    useDeleteAdminReviewVideoMutation,
} from "./api/adminVideoApi";

export { videoAdminAdapter, videoAdminApiAdapter } from "./lib/adminVideoAdapter";

// Donation

export {
    adminDonationApi,
    useLazyGetAdminDonationsQuery,
    useDeleteAdminDonationMutation,
    useGetAdminDonationReportsQuery,
    useGetAdminDonationReportQuery,
    useCreateAdminDonationReportMutation,
    useUpdateAdminDonationReportMutation,
    useDeleteAdminDonationReportMutation,
} from "./api/adminDonationApi";

export type {
    CreateAdminDonationReport,
    GetAdminDonationReport,
    AdminDonationReportFields,
    AdminDonationReportFileFields,
} from "./model/types/adminDonationSchema";

export { adminDonationsAdapter } from "./lib/adminDonationAdapter";
