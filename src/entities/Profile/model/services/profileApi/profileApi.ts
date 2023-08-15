import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { Profile } from "../../types/profile";
import { baseQuery } from "@/shared/api/baseQuery/baseQuery";

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery,
    tagTypes: ["profile"],
    endpoints: (build) => ({
        getProfileInfo: build.query<Profile, void>({
            query: () => ({
                url: "/profile/",
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
    }),
});
