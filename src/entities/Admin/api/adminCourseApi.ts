import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    CreateAdminCourseRequest, GetAdminCourse, GetAdminCoursesParams,
    GetAdminCoursesResponse, UpdateAdminCourseRequest,
} from "../model/types/adminCourseSchema";

export const adminCourseApi = createApi({
    reducerPath: "adminCourseApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["course",
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
        getAdminCourseById: build.query<GetAdminCourse, string>({
            query: (courseId) => ({
                url: `course/${courseId}`, // not exist
                method: "GET",
            }),
            providesTags: ["course"],
        }),
        createAdminCourse: build.mutation<void, CreateAdminCourseRequest>({
            query: () => ({
                url: "course/create", // not exist
                method: "POST",
            }),
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
    }),
});

export const {
    useLazyGetAdminCoursesQuery,
    useGetAdminCourseByIdQuery,
    useCreateAdminCourseMutation,
    useUpdateAdminCourseMutation,
    useDeleteAdminCourseMutation,
} = adminCourseApi;
