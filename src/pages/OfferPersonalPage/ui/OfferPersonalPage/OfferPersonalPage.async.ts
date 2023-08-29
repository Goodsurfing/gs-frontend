import { lazy } from "react";

export const OfferPersonalPageAsync = lazy(() => import("./OfferPersonalPage").then((module) => ({ default: module.OfferPersonalPage })));
