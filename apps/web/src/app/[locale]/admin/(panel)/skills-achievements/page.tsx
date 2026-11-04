import { Suspense } from "react";

import { DictionaryList } from "@/components/admin/sections/dictionaries";

/** Навыки и достижения пользователей — два справочника на одной странице, как в старой админке */
export default function Page() {
    return <Suspense><div className="flex flex-col gap-8"><DictionaryList kind="skill" /><DictionaryList kind="achievement" /></div></Suspense>;
}
