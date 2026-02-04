import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import { GetAdminCoursesParams, GetAdminCoursesResponse } from "../model/types/adminCourseSchema";

export const adminCourseApi = createApi({
    reducerPath: "adminCourseApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["course",
    ],
    endpoints: (build) => ({
        getCourses: build.query<GetAdminCoursesResponse, Partial<GetAdminCoursesParams>>({
            query: (params) => ({
                url: "courses/list", // not exist
                method: "GET",
                params,
            }),
            providesTags: ["course"],
        }),
    }),
});

export const { useLazyGetCoursesQuery } = adminCourseApi;
