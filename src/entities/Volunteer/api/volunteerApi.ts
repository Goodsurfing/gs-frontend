import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import { VolunteerApi, VolunteerType } from "../model/types/volunteer";
import { WhatToDoSkillType } from "@/types/skills";

interface UpdateVolunteerParams {
    profileId: string;
    body: Partial<VolunteerType>;
}

export interface CreateVolunteerRequest {
    externalInfo: string,
    skills: WhatToDoSkillType[],
    additionalSkills: string[],
}

export const volunteerApi = createApi({
    reducerPath: "volunteerApi",
    baseQuery: baseQueryAcceptJson,
    tagTypes: ["volunteer"],
    endpoints: (build) => ({
        getMyVolunteer: build.query<VolunteerApi, void>({
            query: () => ({
                url: "personal/volunteer",
                method: "GET",
            }),
            providesTags: ["volunteer"],
        }),
        createVolunteer: build.mutation<VolunteerApi, CreateVolunteerRequest>({
            query: (body) => ({
                url: "personal/volunteer",
                method: "POST",
                body,
            }),
            invalidatesTags: ["volunteer"],
        }),
        getVolunteerById: build.query<VolunteerApi, string>({
            query: (profileId) => ({
                url: `volunteers/${profileId}`,
                method: "GET",
            }),
            providesTags: ["volunteer"],
        }),
        updateVolunteerById: build.mutation<VolunteerApi, UpdateVolunteerParams>({
            query: ({ profileId, body }) => ({
                url: `volunteers/${profileId}`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                },
                body: JSON.stringify(body),
            }),
            invalidatesTags: ["volunteer"],
        }),
    }),
});

export const {
    useCreateVolunteerMutation,
    useGetMyVolunteerQuery,
    useGetVolunteerByIdQuery,
    useLazyGetVolunteerByIdQuery,
    useUpdateVolunteerByIdMutation,
} = volunteerApi;
