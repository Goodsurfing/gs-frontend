import { Suspense } from "react";

import { PushLogList } from "@/components/admin/sections/pushLog";

export default function Page() {
    return <Suspense><PushLogList /></Suspense>;
}
