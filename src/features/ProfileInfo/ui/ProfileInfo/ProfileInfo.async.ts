import { lazy } from "react";

export const ProfileInfoAsync = lazy(() => import("./ProfileInfo").then((module) => ({ default: module.ProfileInfo })));
