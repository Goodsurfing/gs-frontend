import { Image } from "@/types/media";

export interface AdminDonationReportFileFields {
    name: string;
    file: Image;
}

export interface AdminDonationReportFields {
    name: string;
    files: AdminDonationReportFileFields[]
}

export interface GetAdminDonationReports {
    id: string;
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

export type UpdateAdminDonationReport = Omit<CreateAdminDonationReport, "files"> & {
    files: {
        name: string;
        fileId: string;
    }[]
};

export interface UpdateAdminDonationReportRequest {
    id: string;
    body: UpdateAdminDonationReport;
}
