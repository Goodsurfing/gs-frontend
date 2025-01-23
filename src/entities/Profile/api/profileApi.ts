import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { Profile, ProfileApi } from "../model/types/profile";
import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";

interface UpdateProfileInfoRequest {
    userId: string;
    profileData: Partial<ProfileApi>
}

interface ChangePasswordRequest {
    plainPassword: string;
    oldPassword: string;
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
        changePassword: build.mutation<Profile, ChangePasswordRequest>({
            query: (body) => ({
                url: "personal/profile/change-password",
                method: "POST",
                body,
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
