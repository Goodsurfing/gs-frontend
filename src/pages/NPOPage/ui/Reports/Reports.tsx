import React, { FC, useMemo } from "react";

import { ReportItem } from "../ReportItem/ReportItem";
import styles from "./Reports.module.scss";
import { reportsMinUstData } from "../../model/data/npo";

export const Reports = () => {
    const renderReportsMinUst = useMemo(
        () => reportsMinUstData.map((report, index) => (
            <ReportItem title={report.title} url={report.url} key={index} />
        )),
        [],
    );
    const renderReportsActivity = useMemo(
        () => reportsMinUstData.map((report, index) => (
            <ReportItem title={report.title} url={report.url} key={index} />
        )),
        [],
    );
    return (
        <div className={styles.wrapper}>
            <h2>Отчёты МинЮст</h2>
            {renderReportsMinUst}
        </div>
    );
};
