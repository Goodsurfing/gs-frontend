import { Suspense } from "react";

import { SystemAdminList } from "@/components/admin/sections/system";

export default function Page() {
    return <Suspense><SystemAdminList /></Suspense>;
}
