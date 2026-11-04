import { Suspense } from "react";

import { ContentList } from "@/components/admin/sections/content";

export default function Page() {
    return <Suspense><ContentList kind="news" /></Suspense>;
}
