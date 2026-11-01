import { Pagination } from "@/types/api/pagination";

export type AdminMembershipCategory = "REGULAR" | "INTERNATIONAL";

export interface AdminTariff {
    code: string;
    name: string;
    forRole: string;
    category: AdminMembershipCategory;
    durationDays: number;
}

export interface AdminMembership {
    id: string;
    tariffCode: string;
    tariffName: string;
    category: AdminMembershipCategory;
    status: string;
    /** PURCHASE — оплата, ADMIN — выдал администратор, LEGACY_IMPORT — со старого сайта */
    source: string;
    privileged: boolean;
    active: boolean;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
}

export interface AdminMembershipLog {
    id: string;
    createdAt: string;
    action: "GRANT" | "REVOKE";
    category: AdminMembershipCategory;
    tariffCode: string;
    endDate: string | null;
    comment: string | null;
    adminId: string | null;
    adminName: string;
    adminEmail: string | null;
    userId: string;
    userName: string;
    userEmail: string;
}

export interface AdminUserMembershipResponse {
    memberships: AdminMembership[];
    history: AdminMembershipLog[];
}

export interface GrantAdminMembershipRequest {
    userId: string;
    tariffCode: string;
    /** Y-m-d; без даты — бессрочно */
    endDate?: string;
    comment?: string;
}

export interface RevokeAdminMembershipRequest {
    userId: string;
    category: AdminMembershipCategory;
    comment?: string;
}

export interface GetAdminMembershipLogResponse {
    data: AdminMembershipLog[];
    pagination: Pagination;
}
