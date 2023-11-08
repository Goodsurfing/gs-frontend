import { lazy } from "react";

export const HostPersonalPageAsync = lazy(() => import("./HostPersonalPage").then((module) => ({ default: module.HostPersonalPage })));
