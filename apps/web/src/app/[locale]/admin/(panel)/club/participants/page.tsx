import { Suspense } from "react";

import { ClubParticipantsList } from "@/components/admin/sections/club";

export default function Page() {
    return <Suspense><ClubParticipantsList /></Suspense>;
}
