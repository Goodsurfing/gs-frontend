import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    CreateAdminCourseRequest, GetAdminCourse, GetAdminCoursesParams,
    GetAdminCoursesResponse, GetAdminReviewCourse, GetAdminReviewsCoursesParams,
    GetAdminReviewsCoursesResponse, UpdateAdminCourseRequest,
    UpdateAdminReviewCourseRequest,
} from "../model/types/adminCourseSchema";
import { objectToFormData } from "@/shared/lib/objectToFormData";

export const adminCourseApi = createApi({
    reducerPath: "adminCourseApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["course", "review",
    ],
    endpoints: (build) => ({
        getAdminCourses: build.query<GetAdminCoursesResponse, Partial<GetAdminCoursesParams>>({
            query: (params) => ({
                url: "courses/list", // not exist
                method: "GET",
                params,
            }),
            providesTags: ["course"],
        }),
        getAdminCourseById: build.query<GetAdminCourse, number>({
            query: (courseId) => ({
                url: `course/${courseId}`, // not exist
                method: "GET",
            }),
            providesTags: ["course"],
        }),
        createAdminCourse: build.mutation<void, CreateAdminCourseRequest>({
            query: (data) => {
                const formData = objectToFormData(data);
                return {
                    url: "course/create", // not exist
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["course"],
        }),
        updateAdminCourse: build.mutation<void, UpdateAdminCourseRequest>({
            query: (courseId) => ({
                url: `course/edit/${courseId}`, // not exist
                method: "PATCH",
            }),
            invalidatesTags: ["course"],
        }),
        deleteAdminCourse: build.mutation<void, number>({
            query: (courseId) => ({
                url: `course/delete/${courseId}`, // not exist
                method: "DELETE",
            }),
            invalidatesTags: ["course"],
        }),
        getAdminReviewsCourses: build.query<GetAdminReviewsCoursesResponse,
        Partial<GetAdminReviewsCoursesParams>>({
            query: (params) => ({
                url: "review-course/list", // not exist
                method: "GET",
                params,
            }),
            providesTags: ["review"],
        }),
        getAdminReviewCourseById: build.query<GetAdminReviewCourse, number>({
            query: (reviewId) => ({
                url: `review-course/${reviewId}`, // not exist
                method: "GET",
            }),
            providesTags: ["review"],
        }),
        updateAdminReviewCourse: build.mutation<void, UpdateAdminReviewCourseRequest>({
            query: (courseId) => ({
                url: `review-course/edit/${courseId}`, // not exist
                method: "PATCH",
            }),
            invalidatesTags: ["review"],
        }),
        deleteAdminReviewCourse: build.mutation<void, number>({
            query: (courseId) => ({
                url: `review-course/delete/${courseId}`, // not exist
                method: "DELETE",
            }),
            invalidatesTags: ["review"],
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
    useGetAdminReviewCourseByIdQuery,
    useUpdateAdminReviewCourseMutation,
    useDeleteAdminReviewCourseMutation,
} = adminCourseApi;
