import React, { FC } from "react";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableRow,
} from "@mui/material";
import { AdminMarketingConsent, AdminUser, MarketingConsentSource } from "../../model/types/adminSchema";
import styles from "./UserInfoTable.module.scss";

const YesText = <div className={styles.yes}>Да</div>;
const NoText = <div className={styles.no}>Нет</div>;

const CONSENT_SOURCES: Record<MarketingConsentSource, string> = {
    registration: "регистрация",
    profile: "профиль",
    email_request: "письмо-запрос",
    unisender: "отписка в рассылке",
    account_deleted: "удаление аккаунта",
};

const formatMoscow = (iso: string) => new Date(iso).toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

/** GS-203: текущее согласие на рассылку — когда и откуда. */
const consentValue = (consent?: AdminMarketingConsent) => {
    if (!consent?.at || !consent.source) {
        return <div className={styles.no}>Не давал</div>;
    }
    const when = `${formatMoscow(consent.at)}, ${CONSENT_SOURCES[consent.source] ?? consent.source}`;
    return consent.consent
        ? <div className={styles.yes}>{`Да — ${when}`}</div>
        : <div className={styles.no}>{`Отозвано — ${when}`}</div>;
};

/** Журнал согласия: доказательство на случай вопросов «отпишите меня» и претензий. */
const consentHistory = (consent?: AdminMarketingConsent) => {
    if (!consent?.history.length) return "—";
    return (
        <ul className={styles.consentHistory}>
            {consent.history.map((entry) => (
                <li key={`${entry.at}-${entry.source}-${String(entry.consent)}`}>
                    <b>{entry.consent ? "Дал согласие" : "Отозвал"}</b>
                    {` · ${formatMoscow(entry.at)} · ${CONSENT_SOURCES[entry.source] ?? entry.source}`}
                    {entry.ip && ` · IP ${entry.ip}`}
                    {entry.wording && <div className={styles.consentWording}>{`«${entry.wording}»`}</div>}
                </li>
            ))}
        </ul>
    );
};

interface UserInfoTableProps {
    userId: string;
    data: AdminUser;
}

export const UserInfoTable: FC<UserInfoTableProps> = (props) => {
    const { userId, data } = props;
    const {
        created, lastVisit, endPayment, isPayment, isActive,
        isVerified, isOrganization, isVolunteer, isDelete, isPrivilegedMembership,
        internationalEndPayment, marketingConsent,
    } = data;

    const rows = [
        { label: "ID", value: userId },
        { label: "Дата регистрации", value: created },
        { label: "Последний вход", value: lastVisit },
        {
            label: "Окончание членства",
            value: isPrivilegedMembership ? "Бессрочно" : endPayment,
        },
        { label: "Активное членство", value: isPayment ? YesText : NoText },
        {
            // Бесплатное бессрочное по решению владельца — не аномалия, не отзывать.
            label: "Привилегированное членство",
            value: isPrivilegedMembership ? YesText : NoText,
        },
        {
            // GS-198: отдельное членство, покупается на странице членства.
            label: "Международный клуб",
            value: internationalEndPayment
                ? <div className={styles.yes}>{`Да, до ${internationalEndPayment}`}</div>
                : NoText,
        },
        { label: "Пользователь удалён", value: isDelete ? YesText : NoText },
        { label: "Активный пользователь", value: isActive ? YesText : NoText },
        { label: "Подтверждён", value: isVerified ? YesText : NoText },
        { label: "Согласие на рассылку", value: consentValue(marketingConsent) },
        { label: "История согласия", value: consentHistory(marketingConsent) },
        { label: "Хост", value: isOrganization ? YesText : NoText },
        { label: "Волонтёр", value: isVolunteer ? YesText : NoText },
    ];

    return (
        <div className={styles.wrapper}>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.label}>
                                <TableCell className={styles.labelCell}>
                                    <b>{row.label}</b>
                                </TableCell>
                                <TableCell className={styles.valueCell}>
                                    {row.value}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};
