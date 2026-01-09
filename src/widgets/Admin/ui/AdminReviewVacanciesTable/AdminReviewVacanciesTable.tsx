import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    FormControl, InputLabel, MenuItem, Select, Stack, TextField,
} from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import messengerIcon from "@/shared/assets/icons/message_icon.svg";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getAdminReviewVacancyPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import {
    AdminReviewVacancySort, AdminSort, useDeleteAdminReviewVacancyMutation,
    useLazyGetAdminReviewVacanciesListQuery,
} from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { useGetFullName } from "@/shared/lib/getFullName";
import { textSlice } from "@/shared/lib/textSlice";
import styles from "./AdminReviewVacanciesTable.module.scss";

interface ReviewVacancyFilters {
    sort?: AdminReviewVacancySort;
    authorLastName?: string;
    authorFirstName?: string;
    vacancyName?: string;
}

const reviewVacancyCustomFields: CustomFilterField<keyof ReviewVacancyFilters>[] = [
    {
        key: "authorFirstName",
        label: "Имя автора",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Имя автора"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "authorLastName",
        label: "Фамилия автора",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Фамилия автора"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "vacancyName",
        label: "Название вакансии",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Название вакансии"
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
                <InputLabel id="review-sort-label" sx={{ background: "background.paper", px: 0.5 }}>
                    Сортировка
                </InputLabel>
                <Select
                    labelId="review-sort-label"
                    value={value || AdminSort.IdAsc}
                    label="Сортировка"
                    onChange={(e) => onChange(e.target.value as AdminSort)}
                    MenuProps={{
                        PaperProps: {
                            style: { maxHeight: 200 },
                        },
                    }}
                >
                    <MenuItem value={AdminSort.IdAsc}>ID ↑</MenuItem>
                    <MenuItem value={AdminSort.IdDesc}>ID ↓</MenuItem>
                    <MenuItem value={AdminSort.FioAuthorAsc}>Автор ФИО ↑</MenuItem>
                    <MenuItem value={AdminSort.FioAuthorDesc}>Автор ФИО ↓</MenuItem>
                    <MenuItem value={AdminSort.RatingAsc}>Рейтинг ↑</MenuItem>
                    <MenuItem value={AdminSort.RatingDesc}>Рейтинг ↓</MenuItem>
                    <MenuItem value={AdminSort.CreatedAsc}>Дата ↑</MenuItem>
                    <MenuItem value={AdminSort.CreatedDesc}>Дата ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

const REVIEWS_PER_PAGE = 30;

export const AdminReviewVacanciesTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [reviewToDelete, setReviewlToDelete] = useState<
    { id: number } | null>(null);
    const [filters, setFilters] = useState<Partial<ReviewVacancyFilters>>({
        sort: AdminSort.IdAsc,
    });
    const { getFullName } = useGetFullName();
    const [getReviews, {
        data: reviewsData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminReviewVacanciesListQuery();
    const [deleteReview, { isLoading: isDeleting }] = useDeleteAdminReviewVacancyMutation();

    useEffect(() => {
        const fetchData = async () => {
            setToast(undefined);
            try {
                await getReviews({
                    page: currentPage,
                    limit: REVIEWS_PER_PAGE,
                    sort: filters.sort ?? AdminSort.IdAsc,
                    authorFirstName: filters.authorFirstName,
                    authorLastName: filters.authorLastName,
                    vacancyName: filters.vacancyName,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке отзывов",
                    type: HintType.Error,
                });
            }
        };
        fetchData();
    }, [currentPage, filters, getReviews]);

    const handleOpenDeleteModal = (id: number) => {
        setReviewlToDelete({ id });
    };

    const handleCloseDeleteModal = () => {
        setReviewlToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!reviewToDelete) return;

        try {
            await deleteReview(reviewToDelete.id).unwrap();
            setToast({
                text: "Отзыв был успешно удален",
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
            field: "name",
            headerName: "Имя автора",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "vacancyName",
            headerName: "Название вакансии",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "rating",
            headerName: "Рейтинг",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "description",
            headerName: "Текст отзыва",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "created",
            headerName: "Дата создания",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
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
                const handleViewClick = () => navigate(
                    getAdminReviewVacancyPersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id);
                };
                const handleMessageClick = () => {
                    if (!params.row.authorId) return;
                    navigate(`${locale}/messenger/create?recipientVolunteer=${params.row.authorId}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleViewClick}
                            type="button"
                            title="Редактировать отзыв"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleMessageClick}
                            type="button"
                            title="Написать пользователю"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={messengerIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить отзыв"
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
            return <span className={styles.text}>Отзывы не были найдены</span>;
        }
        const adaptedData: any[] = reviewsData.data.map((review) => {
            const {
                id, authorFirstName, authorLastName,
                vacancyName,
                rating, description, created, authorId,
            } = review;
            return {
                id,
                authorId,
                name: getFullName(authorFirstName, authorLastName),
                vacancyName: textSlice(vacancyName, 50, "title"),
                rating,
                description,
                created,
            };
        });
        return (
            <DataGrid
                rows={adaptedData ?? []}
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
            <h2>Таблица отзывов на вакансии</h2>
            <div className={styles.actionButtons}>
                <AdminFiltersTable
                    filters={filters}
                    onFilterChange={setFilters}
                    onApply={handleApplyFilters}
                    disabled={isLoading}
                    customFields={reviewVacancyCustomFields}
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
                description="Вы уверены, что хотите удалить отзыв? Это действие нельзя отменить."
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
