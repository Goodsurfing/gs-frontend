import React from "react";
import { Link } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    formatAdminDateTime, formatLogEndDate, MEMBERSHIP_ACTION_LABEL, useGetAdminMembershipLogQuery,
} from "@/entities/Admin";
import { getAdminPersonalUserPageUrl } from "@/shared/config/routes/AppUrls";
import { useQueryFilters } from "@/shared/hooks/usePaginationParams";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { OfferPagination } from "@/widgets/OffersMap";
import styles from "./AdminMembershipLogTable.module.scss";

const PER_PAGE = 30;

/** Кто, когда и кому выдал или снял членство вручную — по всем пользователям */
export const AdminMembershipLogTable = () => {
    const { locale } = useLocale();
    const { filters, setFilters } = useQueryFilters({ page: 1 });
    const { data, isFetching, isError } = useGetAdminMembershipLogQuery({
        page: filters.page,
        limit: PER_PAGE,
    });

    if (isFetching) return <MiniLoader />;
    if (isError || !data) return <p className={styles.empty}>Не удалось загрузить журнал</p>;
    if (data.data.length === 0) {
        return <p className={styles.empty}>Вручную членство ещё не выдавали</p>;
    }

    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Когда</th>
                        <th>Кто</th>
                        <th>Действие</th>
                        <th>Кому</th>
                        <th>Тариф</th>
                        <th>До</th>
                        <th>Комментарий</th>
                    </tr>
                </thead>
                <tbody>
                    {data.data.map((entry) => (
                        <tr key={entry.id}>
                            <td>{formatAdminDateTime(entry.createdAt)}</td>
                            <td>
                                {entry.adminName}
                                {entry.adminEmail && (
                                    <span className={styles.caption}>{entry.adminEmail}</span>
                                )}
                            </td>
                            <td>{MEMBERSHIP_ACTION_LABEL[entry.action]}</td>
                            <td>
                                <Link to={getAdminPersonalUserPageUrl(locale, entry.userId)}>
                                    {entry.userName || entry.userEmail}
                                </Link>
                                {entry.userName && (
                                    <span className={styles.caption}>{entry.userEmail}</span>
                                )}
                            </td>
                            <td>{entry.tariffCode}</td>
                            <td>{formatLogEndDate(entry)}</td>
                            <td className={styles.comment}>{entry.comment ?? "—"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <OfferPagination
                currentPage={filters.page}
                totalPages={Math.ceil(data.pagination.total / PER_PAGE)}
                onPageChange={(page) => setFilters({ page })}
            />
        </div>
    );
};
