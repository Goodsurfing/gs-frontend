import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ORGANIZATIONS_BASE_URL } from "@/shared/constants/api";
import { OrganizationApiEndpoints } from "@/types/api/organization";
import { IOrganizationRegistrationResponse, IOrganizationRegistrationParams } from "@/types/api/organization/organizationRegistration.interface";
import { IOrganizationBuildData } from "@/types/api/organization/organizationBuild.interface";
import { IOrganizationUpdateData } from "@/types/api/organization/organizationUpdate.interface";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";

export const organizationApi = createApi({
    reducerPath: "organizationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_ORGANIZATIONS_BASE_URL,
        prepareHeaders(headers) {
            const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);

            if (token) {
                headers.set("Authorization", `Bearer ${JSON.parse(token)}`);
            }
            return headers;
        },
    }),

    endpoints: (build) => ({
        registerOrganization: build.mutation<
        IOrganizationRegistrationResponse,
        IOrganizationRegistrationParams
        >({
            query: (data: IOrganizationRegistrationParams) => ({
                url: OrganizationApiEndpoints.REGISTER,
                method: "POST",
                body: data,
            }),
        }),
        getOrganizations: build.query({
            query: () => ({
                url: OrganizationApiEndpoints.GET_ALL,
            }),
        }),
        bindOrganization: build.mutation<unknown, IOrganizationBuildData>({
            query: (data: IOrganizationBuildData) => ({
                url: `${OrganizationApiEndpoints.REGISTER}${data.uuid}${OrganizationApiEndpoints.JOIN}`,
                method: "PUT",
                body: {
                    name: data.name,
                    description: data.description,
                },
            }),
        }),
        updateOrganization: build.mutation<unknown, IOrganizationUpdateData>({
            query: (data: IOrganizationUpdateData) => ({
                url: `${OrganizationApiEndpoints.UPDATE}${data.id}`,
                method: "PUT",
                body: data,
            }),
        }),
    }),
});
