import { lazy } from "react";

export const AdminOfferConditionsPageAsync = lazy(() => import("./AdminOfferConditionsPage").then((module) => ({ default: module.AdminOfferConditionsPage })));
