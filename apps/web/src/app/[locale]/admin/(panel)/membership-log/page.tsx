import { Suspense } from "react";

import { MembershipLogList } from "@/components/admin/sections/system";

export default function Page() {
    return <Suspense><MembershipLogList /></Suspense>;
}
