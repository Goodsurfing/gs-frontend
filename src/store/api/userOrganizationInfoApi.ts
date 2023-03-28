import { API_ORGANIZATIONS_BASE_URL} from "@/constants/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/store/store";

export const userOrganizationInfoApi = createApi({
    reducerPath: "userOrganizationInfoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_ORGANIZATIONS_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const { token } = (getState() as RootState).login;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            headers.set("Content-Type", "application/json");

            return headers;
        },
    }),
    tagTypes: ["userOrganizationInfo"],
    endpoints: (build) => {
        return {       
            getUserOrganizationInfo: build.query({
                query: (id: string) => {
                    return {
                        url: `/organization/${id}`,
                        method: "GET",
                    }
                },
                providesTags: ["userOrganizationInfo"]
            }),
        };
    },
});

