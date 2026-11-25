import { Suspense } from "react";

import { ComplaintsList } from "@/components/admin/sections/complaints";

export default function Page() {
    return <Suspense><ComplaintsList /></Suspense>;
}
