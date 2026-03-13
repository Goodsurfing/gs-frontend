import { Image } from "@/types/media";

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
