import { Suspense } from "react";

import { SiteList } from "@/components/admin/sections/site";

export default function Page() {
    return <Suspense><SiteList kind="team" /></Suspense>;
}
