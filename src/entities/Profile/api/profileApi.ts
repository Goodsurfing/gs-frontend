import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { Profile } from "../model/types/profile";
import { baseQuery } from "@/shared/api/baseQuery/baseQuery";

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery,
    tagTypes: ["profile"],
    endpoints: (build) => ({
        getProfileInfo: build.query<Profile, void>({
            query: () => ({
                url: "personal/profile",
                method: "GET",
            }),
            providesTags: ["profile"],
        }),
        updateProfileInfo: build.mutation<Profile, Partial<Profile>>({
            query: (profileData) => ({
                url: "personal/profile",
                method: "PATCH",
                body: profileData,
            }),
            invalidatesTags: ["profile"],
        }),
    }),
});

export const {
    useGetProfileInfoQuery,
    useUpdateProfileInfoMutation,
} = profileApi;
