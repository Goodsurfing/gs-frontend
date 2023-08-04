import { lazy } from "react";

export const OfferWhatToDoPageAsync = lazy(() => import("./OfferWhatToDoPage").then((module) => ({ default: module.OfferWhatToDoPage })));
