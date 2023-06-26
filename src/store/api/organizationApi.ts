import { API_ORGANIZATIONS_BASE_URL } from "@/shared/constants/api";
import { OrganizationApiEndpoints } from "@/types/api/organization";
import { IOrganizationRegistrationResponse, IOrganizationRegistrationParams } from "@/types/api/organization/organizationRegistration.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { IOrganizationBuildData } from "@/types/api/organization/organizationBuild.interface";
import { IOrganizationUpdateData } from "@/types/api/organization/organizationUpdate.interface";

export const organizationApi = createApi({
    reducerPath: "organizationApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: API_ORGANIZATIONS_BASE_URL, 
        prepareHeaders(headers, { getState }) {
            const token = (getState() as RootState).login.token;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    
    endpoints: (build) => {
        return {
            registerOrganization: build.mutation<IOrganizationRegistrationResponse, IOrganizationRegistrationParams>({
                query: (data: IOrganizationRegistrationParams) => {
                    return {
                        url: OrganizationApiEndpoints.REGISTER,
                        method: "POST",
                        body: data,
                    }
                }
            }),
            getOrganizations: build.query({
                query: () => ({
                    url: OrganizationApiEndpoints.GET_ALL,
                })
            }),
            bindOrganization: build.mutation<unknown, IOrganizationBuildData>({
                query: (data: IOrganizationBuildData) => {
                    return {
                        url: `${OrganizationApiEndpoints.REGISTER}${data.uuid}${OrganizationApiEndpoints.JOIN}`,
                        method: "PUT",
                        body: {
                            name: data.name,
                            description: data.description
                        },
                    }
                }
            }),
            updateOrganization: build.mutation<unknown, IOrganizationUpdateData>({
                query: (data: IOrganizationUpdateData) => {
                    return {
                        url: `${OrganizationApiEndpoints.UPDATE}${data.id}`,
                        method: "PUT",
                        body: data
                    }
                }
            })
        }
    },
})