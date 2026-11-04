import { Suspense } from "react";

import { DictionaryList } from "@/components/admin/sections/dictionaries";

export default function Page() {
    return <Suspense><DictionaryList kind="blogCategory" /></Suspense>;
}
