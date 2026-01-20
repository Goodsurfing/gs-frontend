import { lazy } from "react";

export const AdminOfferWhatToDoPageAsync = lazy(() => import("./AdminOfferWhatToDoPage").then((module) => ({ default: module.AdminOfferWhatToDoPage })));
