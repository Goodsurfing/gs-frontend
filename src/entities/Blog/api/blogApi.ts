import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryV3 } from "@/shared/api/baseQuery/baseQuery";
import {
    BlogCategory,
    CreateBlog,
    CreateReviewBlog,
    GetBlog,
    GetBlogCategoriesParams,
    GetBlogListParams,
    GetBlogListResponse,
    GetReviewsBlogResponse,
    GetBlogParams,
    UpdateBlogParams,
    GetReviewsBlogParams,
    PublicBlogParams,
} from "../model/types/blogSchema";

export const blogApi = createApi({
    reducerPath: "blogApi",
    baseQuery: baseQueryV3,
    tagTypes: ["blog", "category"],
    endpoints: (build) => ({
        getBlogList: build.query<GetBlogListResponse, Partial<GetBlogListParams>>({
            query: (params) => ({
                url: "blog",
                method: "GET",
                params,
            }),
            providesTags: ["blog"],
        }),
        getBlogById: build.query<GetBlog, GetBlogParams>({
            query: ({ id, lang }) => ({
                url: `blog/${id}`,
                method: "GET",
                params: { lang },
            }),
            providesTags: ["blog"],
        }),
        publicBlogById: build.mutation<void, PublicBlogParams>({
            query: ({ id, body }) => ({
                url: `blog/${id}/toggle-active`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["blog"],
        }),
        createBlog: build.mutation<void, CreateBlog>({
            query: (body) => ({
                url: "blog",
                method: "POST",
                body,
            }),
            invalidatesTags: ["blog"],
        }),
        updateBlog: build.mutation<void, UpdateBlogParams>({
            query: ({ id, body }) => ({
                url: `blog/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["blog"],
        }),
        putLikeBlog: build.mutation<void, number>({
            query: (id) => ({
                url: `blog/like/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["blog"],
        }),
        deleteBlog: build.mutation<void, number>({
            query: (id) => ({
                url: `blog/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["blog"],
        }),
        // Categories
        getBlogCategories: build.query<BlogCategory[], GetBlogCategoriesParams>({
            query: (params) => ({
                url: "blog-category",
                method: "GET",
                params,
            }),
            providesTags: ["category"],
        }),
        // Review Blog
        getReviewsBlog: build.query<GetReviewsBlogResponse, GetReviewsBlogParams>({
            query: ({ blogId, page, limit }) => ({
                url: `review-blog/list/${blogId}`,
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["blog"],
        }),
        createReviewBlog: build.mutation<void, CreateReviewBlog>({
            query: (body) => ({
                url: "review-blog",
                method: "POST",
                body,
            }),
            invalidatesTags: ["blog"],
        }),
    }),
});

export const {
    useLazyGetBlogListQuery,
    useGetBlogByIdQuery,
    usePublicBlogByIdMutation,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    usePutLikeBlogMutation,
    useDeleteBlogMutation,
    useGetBlogCategoriesQuery,
    useLazyGetReviewsBlogQuery,
    useCreateReviewBlogMutation,
} = blogApi;
