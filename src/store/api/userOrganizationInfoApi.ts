import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ORGANIZATIONS_BASE_URL } from "@/shared/constants/api";
import { IGetOrganizationInfo } from "@/types/api/organization/organizationInfo.interface";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";

export const userOrganizationInfoApi = createApi({
    reducerPath: "userOrganizationInfoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_ORGANIZATIONS_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
            if (token) {
                headers.set("Authorization", `Bearer ${JSON.parse(token)}`);
            }
            headers.set("Content-Type", "application/json");

            return headers;
        },
    }),
    tagTypes: ["userOrganizationInfo"],
    endpoints: (build) => ({
        getUserOrganizationInfo: build.query<IGetOrganizationInfo, string>({
            query: (id) => ({
                url: `/organization/${id}`,
                method: "GET",
            }),
            providesTags: ["userOrganizationInfo"],
        }),
    }),
});
