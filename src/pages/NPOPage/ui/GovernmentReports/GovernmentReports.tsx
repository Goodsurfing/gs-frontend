import React from "react";
import { useTranslation } from "react-i18next";

import { ReportItem } from "@/shared/ui/ReportItem/ReportItem";
import styles from "./GovernmentReports.module.scss";

interface ReportFile {
    year: string;
    file: string;
}

const NPO_DOCS_BASE = "/assets/docs/npo";

// PDF физически лежат в public/assets/docs/npo — перенесены со старого
// сайта (old.goodsurfing.org/about-nko), но на странице /npo не были нигде
// отрендерены, из-за чего отчёты «пропали» (ROW 93). Здесь возвращаем их
// на страницу двумя секциями, как на исходном сайте.
const MINISTRY_REPORTS: ReportFile[] = [
    { year: "2018", file: "Отчётность в Минюст за 2018 г..pdf" },
    { year: "2019", file: "Отчётность в Минюст за 2019 г..pdf" },
    { year: "2020", file: "2020-report.pdf" },
    { year: "2021", file: "Отчётность_Минюст _2021.pdf" },
    { year: "2022", file: "Отчётность_Минюст_2022.pdf" },
    { year: "2023", file: "Отчётность_Минюст_2023.pdf" },
];

const ACTIVITY_REPORTS: ReportFile[] = [
    { year: "2019", file: "2019_отчет_деятельности.pdf" },
    { year: "2020", file: "2020_отчет_деятельности.pdf" },
    { year: "2021", file: "2021-report.pdf" },
    { year: "2022", file: "Отчет о деятельности 2022.pdf" },
    { year: "2023", file: "Отчет о деятельности 2023(1).pdf" },
    { year: "2024", file: "Отчет о деятельности 2024(2).pdf" },
    { year: "2025", file: "Отчет о деятельности 2025.pdf" },
];

const reportUrl = (file: string): string => encodeURI(`${NPO_DOCS_BASE}/${file}`);

export const GovernmentReports = () => {
    const { t } = useTranslation("npo");

    const renderSection = (titleKey: string, fallback: string, reports: ReportFile[]) => (
        <div className={styles.report}>
            <h2 className={styles.title}>{t(titleKey, fallback)}</h2>
            <div className={styles.container}>
                {reports.map((report) => (
                    <ReportItem
                        key={report.file}
                        title={`${report.year} год`}
                        url={reportUrl(report.file)}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className={styles.wrapper}>
            {renderSection("Отчёты в Минюст", "Отчёты в Минюст", MINISTRY_REPORTS)}
            {renderSection("Отчёты о деятельности", "Отчёты о деятельности", ACTIVITY_REPORTS)}
        </div>
    );
};
