import { createApi } from "@reduxjs/toolkit/dist/query/react";
import {
    Profile, ProfileById, UpdateProfile, UpdateProfileCertificates,
    UpdateProfileImageGallery, UpdateProfilePreferences,
    UpdateProfileVideoGallery,
} from "../model/types/profile";
import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import { API_BASE_URL_V3 } from "@/shared/constants/api";
import { UpdateVolunteer } from "@/entities/Volunteer";

interface ChangePasswordRequest {
    plainPassword: string;
    oldPassword: string;
}

interface ToggleActiveProfileRequest {
    body: {
        isActive: boolean;
    }
}
interface ProfileSearchByEmailRequest {
    itemsPerPage?: number;
    page?: number;
    email: string;
}

interface UnreadMessagesResponse {
    unreadMessagesCount: number;
}

interface ProfileOccupancyResponse {
    isSkill: false,
    isPhoto: false,
    isVideo: false,
    isBlogPost: false,
    isMembership: false
}

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQueryAcceptJson,
    tagTypes: ["profile"],
    endpoints: (build) => ({
        getProfileInfo: build.query<Profile, void>({
            query: () => ({
                url: `${API_BASE_URL_V3}profile`,
                method: "GET",
            }),
            providesTags: ["profile"],
        }),
        getProfileInfoById: build.query<ProfileById, string>({
            query: (userId) => ({
                url: `${API_BASE_URL_V3}profile/${userId}`,
                method: "GET",
            }),
            providesTags: ["profile"],
        }),
        updateProfileInfo: build.mutation<void, UpdateProfile>({
            query: (body) => ({
                url: `${API_BASE_URL_V3}profile`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["profile"],
        }),
        updateVolunteer: build.mutation<void, UpdateVolunteer>({
            query: (body) => ({
                url: `${API_BASE_URL_V3}volunteer`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["profile"],
        }),
        updateProfileVideoGallery: build.mutation<void, UpdateProfileVideoGallery>({
            query: (body) => ({
                url: `${API_BASE_URL_V3}profile/video-gallery`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["profile"],
        }),
        updateProfileImageGallery: build.mutation<void, UpdateProfileImageGallery>({
            query: (body) => ({
                url: `${API_BASE_URL_V3}profile/image-gallery`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["profile"],
        }),
        updateProfileCertificates: build.mutation<void, UpdateProfileCertificates>({
            query: (body) => ({
                url: `${API_BASE_URL_V3}volunteer/certificate`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["profile"],
        }),
        updateProfilePreferences: build.mutation<void, UpdateProfilePreferences>({
            query: (body) => ({
                url: `${API_BASE_URL_V3}profile/favorite-category`,
                method: "PATCH",
                body,
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
        toggleActiveProfile: build.mutation<void, ToggleActiveProfileRequest>({
            query: ({ body }) => ({
                url: `${API_BASE_URL_V3}profile/toggle-active`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["profile"],
        }),
        deleteProfile: build.mutation<void, string>({
            query: (profileId) => ({
                url: `${API_BASE_URL_V3}profile/${profileId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["profile"],
        }),
        getProfileSearchByEmail: build.query<Profile[], ProfileSearchByEmailRequest>({
            query: (params) => ({
                url: "users/search",
                method: "GET",
                params,
            }),
            providesTags: ["profile"],
        }),
        getUnreadMessages: build.query<UnreadMessagesResponse, void>({
            query: () => ({
                url: "personal/unread-messages",
                method: "GET",
            }),
        }),
        getProfileOccupancy: build.query<ProfileOccupancyResponse, void>({
            query: () => ({
                url: `${API_BASE_URL_V3}profile/occupancy`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetProfileInfoQuery,
    useLazyGetProfileInfoQuery,
    useGetProfileInfoByIdQuery,
    useLazyGetProfileInfoByIdQuery,
    useUpdateProfileInfoMutation,
    useChangePasswordMutation,
    useGetProfileSearchByEmailQuery,
    useLazyGetProfileSearchByEmailQuery,
    useLazyGetUnreadMessagesQuery,
    useToggleActiveProfileMutation,
    useUpdateProfilePreferencesMutation,
    useUpdateProfileVideoGalleryMutation,
    useUpdateProfileImageGalleryMutation,
    useUpdateProfileCertificatesMutation,
    useUpdateVolunteerMutation,
    useDeleteProfileMutation,
    useGetProfileOccupancyQuery,
} = profileApi;
