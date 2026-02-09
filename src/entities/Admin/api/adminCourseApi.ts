import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    CreateAdminCourseLesson,
    CreateAdminCourseRequest, GetAdminCourse, GetAdminCourseLesson, GetAdminCourseLessonsRequest,
    GetAdminCourseLessonsResponse, GetAdminCoursesParams,
    GetAdminCoursesResponse, GetAdminExpert, GetAdminExpertsRequest, GetAdminExpertsResponse,
    GetAdminReviewLesson, GetAdminReviewsCoursesParams,
    GetAdminReviewsCoursesResponse, GetReviewsLessonRequest, UpdateAdminCourseRequest,
    UpdateAdminReviewCourseRequest,
} from "../model/types/adminCourseSchema";

export const adminCourseApi = createApi({
    reducerPath: "adminCourseApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["course", "review", "lesson",
        "expert",
    ],
    endpoints: (build) => ({
        // Courses
        getAdminCourses: build.query<GetAdminCoursesResponse, Partial<GetAdminCoursesParams>>({
            query: (params) => ({
                url: "course/list",
                method: "GET",
                params,
            }),
            providesTags: ["course"],
        }),
        getAdminCourseById: build.query<GetAdminCourse, string>({
            query: (courseId) => ({
                url: `course/element/${courseId}`,
                method: "GET",
            }),
            providesTags: ["course"],
        }),
        createAdminCourse: build.mutation<void, CreateAdminCourseRequest>({
            query: (body) => ({
                url: "course/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["course"],
        }),
        updateAdminCourse: build.mutation<void, UpdateAdminCourseRequest>({
            query: ({ id, body }) => ({
                url: `course/edit/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["course"],
        }),
        deleteAdminCourse: build.mutation<void, number>({
            query: (courseId) => ({
                url: `course/delete/${courseId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["course"],
        }),
        // Review
        getAdminReviewsCourses: build.query<GetAdminReviewsCoursesResponse,
        Partial<GetAdminReviewsCoursesParams>>({
            query: (params) => ({
                url: "review-course/list", // not exist
                method: "GET",
                params,
            }),
            providesTags: ["review"],
        }),
        getAdminReviewsLessonById: build.query<GetAdminReviewsCoursesResponse,
        GetReviewsLessonRequest>({
            query: ({ lessonId, page, limit }) => ({
                url: `review/video-course/list/${lessonId}`,
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["review"],
        }),
        getAdminReviewLessonById: build.query<GetAdminReviewLesson, string>({
            query: (reviewId) => ({
                url: `review/video-course/element/${reviewId}`,
                method: "GET",
            }),
            providesTags: ["review"],
        }),
        updateAdminReviewLesson: build.mutation<void, UpdateAdminReviewCourseRequest>({
            query: ({ id, body }) => ({
                url: `review/video-course/edit/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["review"],
        }),
        deleteAdminReviewLesson: build.mutation<void, number>({
            query: (reviewId) => ({
                url: `review/video-course/${reviewId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["review"],
        }),
        // Lesson
        getAdminCourseLessons: build.query<GetAdminCourseLessonsResponse,
        GetAdminCourseLessonsRequest>({
            query: ({ courseId, page, limit }) => ({
                url: `video-course/list/${courseId}`,
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["lesson"],
        }),
        getAdminCourseLesson: build.query<GetAdminCourseLesson,
        string>({
            query: (lessonId) => ({
                url: `video-course/element/${lessonId}`,
                method: "GET",
            }),
            providesTags: ["lesson"],
        }),
        createAdminCourseLesson: build.mutation<void, CreateAdminCourseLesson>({
            query: (body) => ({
                url: "video-course/create",
                method: "CREATE",
                body,
            }),
            invalidatesTags: ["lesson"],
        }),
        updateAdminCourseLesson: build.mutation<void, CreateAdminCourseLesson>({
            query: (body) => ({
                url: "video-course/edit/{id}",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["lesson"],
        }),
        deleteAdminCourseLesson: build.mutation<void, string>({
            query: (courseId) => ({
                url: `video-course/edit/${courseId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["lesson"],
        }),
        // Experts
        getCourseExperts: build.query<GetAdminExpertsResponse, GetAdminExpertsRequest>({
            query: (params) => ({
                url: "expert/list",
                method: "GET",
                params,
            }),
            providesTags: ["expert"],
        }),
        getCourseExpertById: build.query<GetAdminExpert, string>({
            query: (expertId) => ({
                url: `expert/element/${expertId}`,
                method: "GET",
            }),
            providesTags: ["expert"],
        }),
        createAdminExpert: build.mutation<void, void>({
            query: (body) => ({
                url: "expert/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["expert"],
        }),
        updateAdminExpert: build.mutation<void, void>({
            query: () => ({
                url: "expert/edit/{id}",
                method: "PATCH",
            }),
            invalidatesTags: ["expert"],
        }),
        deleteAdminExpert: build.mutation<void, void>({
            query: () => ({
                url: "expert/{id}",
                method: "DELETE",
            }),
            invalidatesTags: ["expert"],
        }),
    }),
});

export const {
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
    useUpdateAdminExpertMutation,
    useDeleteAdminExpertMutation,
} = adminCourseApi;
