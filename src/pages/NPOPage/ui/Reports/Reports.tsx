import React, { useMemo } from "react";

import { ReportItem } from "../ReportItem/ReportItem";
import { reportsMinUstData, reportsActivityData } from "../../model/data/npo";
import styles from "./Reports.module.scss";

export const Reports = () => {
    const renderReportsMinUst = useMemo(
        () => reportsMinUstData.map((report, index) => (
            <ReportItem title={report.title} url={report.url} key={index} />
        )),
        [],
    );
    const renderReportsActivity = useMemo(
        () => reportsActivityData.map((report, index) => (
            <ReportItem title={report.title} url={report.url} key={index} />
        )),
        [],
    );
    return (
        <div className={styles.wrapper}>
            <h2 className={styles.titleReports}>Отчёты МинЮст</h2>
            <div className={styles.container}>
                {renderReportsMinUst}
            </div>
            <h2 className={styles.titleActivity}>Отчёты о деятельности</h2>
            <div className={styles.container}>
                {renderReportsActivity}
            </div>
        </div>
    );
};
