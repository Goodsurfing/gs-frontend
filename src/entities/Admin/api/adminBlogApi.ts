import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    CreateBlogCategory,
    GetAdminBlog, GetAdminBlogCategoriesParams, GetAdminBlogCategoriesResponse,
    GetAdminBlogCategory, GetAdminBlogListParams, GetAdminBlogListResponse,
    GetAdminReviewBlog, GetAdminReviewBlogParams, GetAdminReviewsBlogResponse,
    UpdateAdminBlog,
    UpdateAdminBlogParams,
    UpdateAdminReviewBlogParams,
    UpdateBlogCategoryParams,
} from "../model/types/adminBlogSchema";

export const adminBlogApi = createApi({
    reducerPath: "adminBlogApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["blog", "category", "review"],
    endpoints: (build) => ({
        getAdminBlogList: build.query<GetAdminBlogListResponse, Partial<GetAdminBlogListParams>>({
            query: (params) => ({
                url: "blog",
                method: "GET",
                params,
            }),
            providesTags: ["blog"],
        }),
        getAdminBlogById: build.query<GetAdminBlog, number>({
            query: (id) => ({
                url: `blog/${id}`,
                method: "GET",
            }),
            providesTags: ["blog"],
        }),
        createAdminBlog: build.mutation<void, UpdateAdminBlog>({
            query: (body) => ({
                url: "blog",
                method: "POST",
                body,
            }),
            invalidatesTags: ["blog"],
        }),
        updateAdminBlog: build.mutation<void, UpdateAdminBlogParams>({
            query: ({ id, body }) => ({
                url: `blog/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["blog"],
        }),
        deleteAdminBlog: build.mutation<void, number>({
            query: (id) => ({
                url: `blog/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["blog"],
        }),
        // Categories
        getAdminBlogCategories: build.query<GetAdminBlogCategoriesResponse,
        GetAdminBlogCategoriesParams>({
            query: (params) => ({
                url: "blog-category",
                method: "GET",
                params,
            }),
            providesTags: ["category"],
        }),
        getAdminBlogCategoryById: build.query<GetAdminBlogCategory, number>({
            query: (id) => ({
                url: `blog-category/${id}`,
                method: "GET",
            }),
            providesTags: ["category"],
        }),
        createAdminBlogCategory: build.mutation<void, CreateBlogCategory>({
            query: (body) => ({
                url: "blog-category",
                method: "POST",
                body,
            }),
            invalidatesTags: ["category"],
        }),
        updateAdminBlogCategory: build.mutation<void, UpdateBlogCategoryParams>({
            query: ({ id, body }) => ({
                url: `blog-category/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["category"],
        }),
        deleteAdminBlogCategory: build.mutation<void, number>({
            query: (id) => ({
                url: `blog-category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["category"],
        }),
        // Review
        getAdminReviewsBlog: build.query<GetAdminReviewsBlogResponse,
        Partial<GetAdminReviewBlogParams>>({
            query: (params) => ({
                url: "review-blog",
                method: "GET",
                params,
            }),
            providesTags: ["review"],
        }),
        getAdminReviewBlogById: build.query<GetAdminReviewBlog,
        string>({
            query: (id) => ({
                url: `review-blog/${id}`,
                method: "GET",
            }),
            providesTags: ["review"],
        }),
        updateAdminReviewBlog: build.mutation<void, UpdateAdminReviewBlogParams>({
            query: ({ id, body }) => ({
                url: `review-blog/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["review"],
        }),
        deleteAdminReviewBlog: build.mutation<void, string>({
            query: (id) => ({
                url: `review-blog/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["category"],
        }),
    }),
});

export const {
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
} = adminBlogApi;
