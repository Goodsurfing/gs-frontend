import { lazy } from "react";

export const VolunteerPersonalPageAsync = lazy(() => import("./VolunteerPersonalPage").then((module) => ({ default: module.VolunteerPersonalPage })));
