import React, { useMemo } from "react";

import { ReportItem } from "@/shared/ui/ReportItem/ReportItem";
import { useGetDonationPublicReportsQuery } from "@/entities/Donation";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./Reports.module.scss";

export const Reports = () => {
    const { data, isLoading } = useGetDonationPublicReportsQuery();

    const renderReports = useMemo(
        () => data?.map((report, index) => {
            const renderFiles = report.files.map((file, indexFile) => (
                <ReportItem
                    title={file.name}
                    url={getMediaContent(file.file.contentUrl) ?? ""}
                    key={indexFile}
                />
            ));
            return (
                <div className={styles.report} key={index}>
                    <h2 className={styles.titleActivity}>{report.name}</h2>
                    <div className={styles.container}>
                        {renderFiles}
                    </div>
                </div>
            );
        }),
        [data],
    );

    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {renderReports}
        </div>
    );
};
