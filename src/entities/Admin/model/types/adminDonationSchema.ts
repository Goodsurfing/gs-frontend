import { DonationStatus } from "@/entities/Donation";
import { Image } from "@/types/media";
import { AdminSort } from "./adminSchema";

// Admin Donations

export interface GetAdminDonations {
    id: string;
    name: string;
    category: string;
    firstName: string;
    lastName: string;
    status: DonationStatus;
    amount: number;
    minAmount: number;
    peopleSupportCount: number;
    percentAmountCollect: number;
    moneyRaised: number;
    endDate: number;
}

export interface GetAdminDonationsParams {
    name?: string;
    firstName?: string;
    lastName?: string;
    sort: AdminSort;
    page: number;
    limit: number;
}

// Donation Reports

export interface AdminDonationReportFileFields {
    id: string | null;
    name: string;
    file: Image;
}

export interface AdminDonationReportFields {
    name: string;
    files: AdminDonationReportFileFields[]
}

export interface GetAdminDonationReports {
    id: string | null;
    name: string;
}

export type GetAdminDonationReport = GetAdminDonationReports & {
    files: {
        id: string;
        name: string;
        file: Image;
    }[];
};

export type CreateAdminDonationReport = Omit<GetAdminDonationReport, "id" | "files"> & {
    files: {
        name: string;
        fileId: string;
    }[]
};

export type UpdateAdminDonationReport = Omit<GetAdminDonationReport, "id" | "files"> & {
    files: {
        id: string | null;
        name: string;
        fileId: string;
    }[]
};

export interface UpdateAdminDonationReportRequest {
    id: string;
    body: UpdateAdminDonationReport;
}
