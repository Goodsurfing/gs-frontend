import { Suspense } from "react";

import { AcademyList } from "@/components/admin/sections/academy";

export default function Page() {
    return <Suspense><AcademyList kind="reviews" /></Suspense>;
}
