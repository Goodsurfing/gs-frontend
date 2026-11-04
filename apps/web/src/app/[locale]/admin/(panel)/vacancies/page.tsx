import { Suspense } from "react";

import { VacanciesList } from "@/components/admin/sections/vacancies";

export default function Page() {
    return <Suspense><VacanciesList /></Suspense>;
}
