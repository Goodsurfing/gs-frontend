import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ORGANIZATION_LOCALSTORAGE_KEY } from "shared/constants/localstorage";

import { Organization, OrganizationSchema } from "../types/OrganizationSchema";

const initialState: OrganizationSchema = {};

export const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganizationData: (state, action: PayloadAction<Organization>) => {
      state.authData = action.payload;
    },
    initAuthData: (state) => {
      const organization = localStorage.getItem(ORGANIZATION_LOCALSTORAGE_KEY);
      if (organization) {
        state.authData = JSON.parse(organization);
      }
    },
    logout: (state) => {
      localStorage.removeItem(ORGANIZATION_LOCALSTORAGE_KEY);
      state.authData = undefined;
    },
  },
});

export const { actions: organizationActions } = organizationSlice;
export const { reducer: organizationReducer } = organizationSlice;

export default organizationSlice.reducer;
