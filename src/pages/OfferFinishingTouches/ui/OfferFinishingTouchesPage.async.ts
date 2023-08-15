import { lazy } from "react";

export const OfferFinishingTouchesAsync = lazy(() => import("./OfferFinishingTouchesPage").then((module) => ({ default: module.OfferFinishingTouchesPage })));
