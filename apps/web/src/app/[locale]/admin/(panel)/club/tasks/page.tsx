import { Suspense } from "react";

import { ClubTasksList } from "@/components/admin/sections/club";

export default function Page() {
    return <Suspense><ClubTasksList /></Suspense>;
}
