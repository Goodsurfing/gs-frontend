import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { Profile, ProfileApi } from "../model/types/profile";
import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";

interface UpdateProfileInfoRequest {
    userId: string;
    profileData: Partial<ProfileApi>
}

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQueryAcceptJson,
    tagTypes: ["profile"],
    endpoints: (build) => ({
        getProfileInfo: build.query<Profile, void>({
            query: () => ({
                url: "personal/profile",
                method: "GET",
            }),
            providesTags: ["profile"],
        }),
        getProfileInfoById: build.query<Profile, string>({
            query: (userId) => ({
                url: `users/${userId}`,
                method: "GET",
            }),
            providesTags: ["profile"],
        }),
        updateProfileInfo: build.mutation<Profile, UpdateProfileInfoRequest>({
            query: ({ userId, profileData }) => ({
                url: `users/${userId}`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                },
                body: JSON.stringify(profileData),
            }),
            invalidatesTags: ["profile"],
        }),
        changePassword: build.mutation<Profile, string>({
            query: (plainPassword) => ({
                url: "personal/profile/change-password",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                },
                body: JSON.stringify({ plainPassword }),
            }),

            invalidatesTags: ["profile"],
        }),
    }),
});

export const {
    useGetProfileInfoQuery,
    useGetProfileInfoByIdQuery,
    useUpdateProfileInfoMutation,
    useChangePasswordMutation,
} = profileApi;
