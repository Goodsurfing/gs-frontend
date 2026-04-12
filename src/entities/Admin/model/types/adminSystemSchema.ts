import { Pagination } from "@/types/api/pagination";
import { AdminSort } from "./adminSchema";

export interface GetAdminSystemListParams {
    sort: AdminSort;
    firstName: string;
    lastName: string;
    email: string;
    page: number;
    limit: number;
}

export interface GetAdminSystemList {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface GetAdminSystemListResponse {
    data: GetAdminSystemList[];
    pagination: Pagination;
}

export interface CreateAdminSystem {
    id: string;
}
