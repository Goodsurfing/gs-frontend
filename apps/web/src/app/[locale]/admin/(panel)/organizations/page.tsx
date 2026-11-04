import { Suspense } from "react";

import { OrganizationsList } from "@/components/admin/sections/organizations";

export default function Page() {
    return <Suspense><OrganizationsList /></Suspense>;
}
