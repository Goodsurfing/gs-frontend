import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { Profile } from "../model/types/profile";
import { baseQuery } from "@/shared/api/baseQuery/baseQuery";

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery,
    tagTypes: ["profile", "host"],
    endpoints: (build) => ({
        getProfileInfo: build.query<Profile, void>({
            query: () => ({
                url: "/user/profile",
                method: "GET",
            }),
            providesTags: ["profile"],
        }),
        updateProfileInfo: build.mutation<Profile, Partial<Profile>>({
            query: (profileData) => ({
                url: "/profile",
                method: "PUT",
                body: profileData,
            }),
            invalidatesTags: ["profile"],
        }),
        joinToHost: build.mutation<Profile, string>({
            query: (organizationId) => ({
                url: `organization/${organizationId}/join/`,
                method: "PUT",
            }),
            invalidatesTags: ["host"],
        }),
    }),
});
