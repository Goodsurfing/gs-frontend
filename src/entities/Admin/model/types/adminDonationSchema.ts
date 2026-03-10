import { Image } from "@/types/media";

export interface GetAdminDonationReports {
    id: string;
    name: string;
}

export type GetAdminDonationReport = GetAdminDonationReports & {
    files: Image[];
};

export type CreateAdminDonationReport = Omit<GetAdminDonationReport, "id">;

export interface UpdateAdminDonationReportRequest {
    id: string;
    body: CreateAdminDonationReport;
}
