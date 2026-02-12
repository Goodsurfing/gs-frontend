import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryV3 } from "@/shared/api/baseQuery/baseQuery";
import {
    GetCoursesResponse,
    GetCoursesParams,
    GetCourse,
    GetReviewsLessonRequest,
    GetReviewsLessonResponse,
    GetLessonsRequest,
    GetLessonsResponse,
    GetLesson,
    CreateReviewLessonRequest,
} from "../model/types/academy";

export const courseApi = createApi({
    reducerPath: "courseApi",
    baseQuery: baseQueryV3,
    tagTypes: ["course", "review", "lesson",
    ],
    endpoints: (build) => ({
        // Course
        getCourses: build.query<GetCoursesResponse, GetCoursesParams>({
            query: (params) => ({
                url: "course/list",
                method: "GET",
                params,
            }),
            providesTags: ["course"],
        }),
        getCourseById: build.query<GetCourse, string>({
            query: (courseId) => ({
                url: `course/element/${courseId}`,
                method: "GET",
            }),
            providesTags: ["course"],
        }),
        watchLesson: build.mutation<void, string>({
            query: (lessonId) => ({
                url: `course/recalculate-count/${lessonId}`,
                method: "PATCH",
            }),
            invalidatesTags: ["course"],
        }),
        // Review on lessons
        getReviewsLesson: build.query<GetReviewsLessonResponse, GetReviewsLessonRequest>({
            query: ({ videoCourseId, page, limit }) => ({
                url: `review/video-course/list/${videoCourseId}`,
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["review"],
        }),
        createReviewLesson: build.mutation<void, CreateReviewLessonRequest>({
            query: () => ({
                url: "review/video-course/create",
                method: "POST",
            }),
            invalidatesTags: ["review"],
        }),
        // Lesson
        getCourseLessons: build.query<GetLessonsResponse, GetLessonsRequest>({
            query: ({ courseId, page, limit }) => ({
                url: `video-course/list/${courseId}`,
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["lesson"],
        }),
        getCourseLessonById: build.query<GetLesson, string>({
            query: (courseId) => ({
                url: `video-course/element/${courseId}`,
                method: "GET",
            }),
            providesTags: ["course"],
        }),
    }),
});

export const {
    useLazyGetCoursesQuery,
    useGetCourseByIdQuery,
    useWatchLessonMutation,
    useLazyGetReviewsLessonQuery,
    useCreateReviewLessonMutation,
    useLazyGetCourseLessonsQuery,
    useGetCourseLessonByIdQuery,
} = courseApi;
