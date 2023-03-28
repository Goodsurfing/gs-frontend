import { API_ORGANIZATIONS_BASE_URL } from "@/constants/api";
import { IOrganizationRegistrationData, OrganizationApiEndpoints } from "@/types/api/organization";
import { IOrganizationRegistrationResponse } from "@/types/api/organization/organizationRegistration.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { IOrganizationBuildData } from "@/types/api/organization/organizationBuild.interface";

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
            registerOrganization: build.mutation<IOrganizationRegistrationResponse, IOrganizationRegistrationData>({
                query: (data: IOrganizationRegistrationData) => {
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
            })
        }
    },
})