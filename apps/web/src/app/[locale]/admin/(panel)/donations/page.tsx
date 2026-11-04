import { Suspense } from "react";

import { FundraisesList } from "@/components/admin/sections/fundraises";

export default function Page() {
    return <Suspense><FundraisesList /></Suspense>;
}
