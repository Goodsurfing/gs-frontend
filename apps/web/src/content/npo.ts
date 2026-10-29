/**
 * Отчёты НКО, лежащие файлами на сайте (public/assets/docs/npo старого
 * фронта, перенесены со старого сайта old.goodsurfing.org/about-nko).
 * Отдаются старым фронтом по /assets/… — путь не меняется.
 */
const NPO_DOCS_BASE = "/assets/docs/npo";

const reportUrl = (file: string) => encodeURI(`${NPO_DOCS_BASE}/${file}`);

export const MINISTRY_REPORTS = [
    { year: "2018", href: reportUrl("Отчётность в Минюст за 2018 г..pdf") },
    { year: "2019", href: reportUrl("Отчётность в Минюст за 2019 г..pdf") },
    { year: "2020", href: reportUrl("2020-report.pdf") },
    { year: "2021", href: reportUrl("Отчётность_Минюст _2021.pdf") },
    { year: "2022", href: reportUrl("Отчётность_Минюст_2022.pdf") },
    { year: "2023", href: reportUrl("Отчётность_Минюст_2023.pdf") },
];

export const ACTIVITY_REPORTS = [
    { year: "2019", href: reportUrl("2019_отчет_деятельности.pdf") },
    { year: "2020", href: reportUrl("2020_отчет_деятельности.pdf") },
    { year: "2021", href: reportUrl("2021-report.pdf") },
    { year: "2022", href: reportUrl("Отчет о деятельности 2022.pdf") },
    { year: "2023", href: reportUrl("Отчет о деятельности 2023(1).pdf") },
    { year: "2024", href: reportUrl("Отчет о деятельности 2024(2).pdf") },
    { year: "2025", href: reportUrl("Отчет о деятельности 2025.pdf") },
];

/** Сканы уставных документов (public/web/images/npo) */
export const CHARTER_DOCUMENTS = ["/web/images/npo/registration.webp", "/web/images/npo/certificate.webp"];
