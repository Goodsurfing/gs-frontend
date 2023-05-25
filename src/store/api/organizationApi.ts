import { API_ORGANIZATIONS_BASE_URL } from "shared/api";
import { OrganizationApiEndpoints } from "types/api/organization";
import { IOrganizationRegistrationResponse, IOrganizationRegistrationParams } from "types/api/organization/organizationRegistration.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IOrganizationBuildData } from "types/api/organization/organizationBuild.interface";
import { IOrganizationUpdateData } from "types/api/organization/organizationUpdate.interface";
import { RootState } from "../store";

export const organizationApi = createApi({
  reducerPath: "organizationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_ORGANIZATIONS_BASE_URL,
    prepareHeaders(headers, { getState }) {
      const { token } = (getState() as RootState).login;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (build) => ({
    registerOrganization: build.mutation<IOrganizationRegistrationResponse, IOrganizationRegistrationParams>({
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
