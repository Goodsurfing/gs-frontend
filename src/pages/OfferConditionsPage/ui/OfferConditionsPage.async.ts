import { lazy } from "react";

export const OfferConditionsPageAsync = lazy(() => import("./OfferConditionsPage").then((module) => ({ default: module.OfferConditionsPage })));
