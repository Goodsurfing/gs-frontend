import { lazy } from "react";

export const DonationPersonalPageAsync = lazy(() => import("./DonationPersonalPage").then((module) => ({ default: module.DonationPersonalPage })));
