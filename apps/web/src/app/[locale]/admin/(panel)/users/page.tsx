import { Suspense } from "react";

import { UsersList } from "@/components/admin/sections/users";

export default function AdminUsersPage() {
    return <Suspense><UsersList /></Suspense>;
}
