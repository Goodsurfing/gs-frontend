import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    FormControl, InputLabel, MenuItem, Select, Stack, TextField,
} from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getAdminReviewsNewsPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { AdminSort, useDeleteAdminReviewNewsMutation, useLazyGetAdminReviewsNewsQuery } from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import styles from "./AdminReviewsNewsTable.module.scss";
import { getFullName } from "@/shared/lib/getFullName";

interface ReviewFilters {
    id?: string;
    newsName?: string;
    firstName?: string;
    lastName?: string;
    sort?: AdminSort;
}

const reviewCustomFields: CustomFilterField<keyof ReviewFilters>[] = [
    {
        key: "id",
        label: "ID",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="ID"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "newsName",
        label: "Название новости",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Название новости"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "firstName",
        label: "Имя пользователя",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Имя пользователя"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "lastName",
        label: "Фамилия пользователя",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Фамилия пользователя"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "sort",
        label: "Сортировка",
        render: ({ value, onChange, disabled }) => (
            <FormControl fullWidth size="small" disabled={disabled}>
                <InputLabel id="skill-sort-label" sx={{ background: "background.paper", px: 0.5 }}>
                    Сортировка
                </InputLabel>
                <Select
                    labelId="skill-sort-label"
                    value={value || AdminSort.IdAsc}
                    label="Сортировка"
                    onChange={(e) => onChange(e.target.value as AdminSort)}
                    MenuProps={{
                        PaperProps: {
                            style: { maxHeight: 200 },
                        },
                    }}
                >
                    <MenuItem value={AdminSort.FioAsc}>ФИО ↑</MenuItem>
                    <MenuItem value={AdminSort.FioDesc}>ФИО ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

const REVIEWS_PER_PAGE = 30;

export const AdminReviewsNewsTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [reviewToDelete, setReviewToDelete] = useState<
    { id: string; } | null>(null);
    const [filters, setFilters] = useState<Partial<ReviewFilters>>({
        sort: AdminSort.IdAsc,
    });
    const [getReviews, {
        data: reviewsData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminReviewsNewsQuery();
    const [deleteReview, { isLoading: isDeleting }] = useDeleteAdminReviewNewsMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getReviews({
                    page: currentPage,
                    limit: REVIEWS_PER_PAGE,
                    sort: filters.sort ?? AdminSort.IdAsc,
                    newsId: filters.id,
                    firstName: filters.firstName,
                    lastName: filters.lastName,
                    newsName: filters.newsName,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке навыков",
                    type: HintType.Error,
                });
            }
        };
        fetchData();
    }, [currentPage, filters, getReviews]);

    const handleOpenDeleteModal = (id: string) => {
        setReviewToDelete({ id });
    };

    const handleCloseDeleteModal = () => {
        setReviewToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!reviewToDelete) return;

        try {
            await deleteReview(reviewToDelete.id).unwrap();
            setToast({
                text: "Комментарий был успешно удален",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Произошла ошибка при удалении",
                type: HintType.Error,
            });
        } finally {
            handleCloseDeleteModal();
        }
    };

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
        {
            field: "newsName",
            headerName: "Новость",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "author",
            headerName: "Автор",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "isActive",
            headerName: "Опубликовано",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
            type: "boolean",
        },
        {
            field: "actions",
            headerName: "Действия",
            width: 160,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            renderCell: (params) => {
                const handleView = () => navigate(
                    getAdminReviewsNewsPersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать комментарий"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить комментарий"
                            className={cn(styles.btnIcon, styles.btnDelete)}
                        >
                            <ReactSVG src={deleteIcon} />
                        </button>
                    </Stack>
                );
            },
        },
    ];

    if (isLoading || isFetching) {
        return (
            <MiniLoader />
        );
    }

    const renderTable = () => {
        if (!reviewsData) {
            return <span className={styles.text}>Комментариев не было найдено</span>;
        }
        const tableData = reviewsData.data.map((review) => ({
            id: review.id,
            newsName: review.news.name,
            author: getFullName(review.author.firstName, review.author.lastName),
            isActive: review.isActive,
        }));

        return (
            <DataGrid
                rows={tableData}
                columns={columns}
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
            />
        );
    };

    const totalPages = () => {
        if (!reviewsData) return 0;
        return Math.ceil(reviewsData.pagination.total / REVIEWS_PER_PAGE);
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h2>Таблица комментариев</h2>
            <div className={styles.actionButtons}>
                <AdminFiltersTable
                    filters={filters}
                    onFilterChange={setFilters}
                    onApply={handleApplyFilters}
                    disabled={isLoading}
                    customFields={reviewCustomFields}
                />
            </div>
            <div className={styles.table}>
                {renderTable()}
            </div>
            <OfferPagination
                currentPage={currentPage}
                totalPages={totalPages()}
                onPageChange={setCurrentPage}
            />
            <ConfirmActionModal
                isModalOpen={!!reviewToDelete}
                description={`Вы уверены, что хотите удалить комментарий "${reviewToDelete?.id}"? Это действие нельзя отменить.`}
                onConfirm={handleConfirmDelete}
                onClose={handleCloseDeleteModal}
                confirmTextButton="Удалить"
                cancelTextButton="Отмена"
                isLoading={isDeleting}
                buttonsDisabled={isDeleting}
            />
        </div>
    );
};
