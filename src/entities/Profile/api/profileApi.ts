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
                url: "users/me",
                method: "GET",
            }),
            providesTags: ["profile"],
        }),
        updateProfileInfo: build.mutation<Profile, Partial<Profile>>({
            query: (profileData) => ({
                url: "users",
                method: "PUT",
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
