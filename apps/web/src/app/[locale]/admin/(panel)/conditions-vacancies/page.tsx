import { Suspense } from "react";

import { DictionaryList } from "@/components/admin/sections/dictionaries";

/** Условия для вакансий: жильё, питание, проезд */
export default function Page() {
    return <Suspense><div className="flex flex-col gap-8"><DictionaryList kind="house" /><DictionaryList kind="food" /><DictionaryList kind="transfer" /></div></Suspense>;
}
