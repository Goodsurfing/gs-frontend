import { Suspense } from "react";

import { ClubCompletionsList } from "@/components/admin/sections/club";

export default function Page() {
    return <Suspense><ClubCompletionsList /></Suspense>;
}
