import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    Checkbox,
    FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Switch, TextField, Tooltip,
} from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import messengerIcon from "@/shared/assets/icons/message_icon.svg";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getAdminReviewVacancyPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import {
    AdminSort, useDeleteAdminReviewVacancyMutation, useEditAdminReviewVacancyMutation,
    useGetAdminReviewVacanciesListQuery,
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
import { useQueryFilters } from "@/shared/hooks/usePaginationParams";
import { buildFeaturedEditBody, isFeaturedCapReached, MAX_FEATURED_REVIEWS } from "./featuredToggle";

interface ReviewVacancyFilters {
    sort?: AdminSort;
    authorLastName?: string;
    authorFirstName?: string;
    vacancyName?: string;
    isFeatured?: string;
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
        key: "isFeatured",
        label: "Только на главной",
        render: ({ value, onChange, disabled }) => (
            <FormControlLabel
                disabled={disabled}
                control={(
                    <Checkbox
                        checked={value === "true"}
                        onChange={(e) => onChange(e.target.checked ? "true" : undefined)}
                    />
                )}
                label="Только на главной"
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
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [reviewToDelete, setReviewlToDelete] = useState<
    { id: string } | null>(null);
    const {
        filters, setFilters,
    } = useQueryFilters({
        page: 1,
        sort: AdminSort.IdAsc,
        authorLastName: undefined,
        authorFirstName: undefined,
        vacancyName: undefined,
        isFeatured: undefined,
    });

    const { getFullName } = useGetFullName();
    const [getReviews, {
        data: reviewsData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminReviewVacanciesListQuery();
    const [deleteReview, { isLoading: isDeleting }] = useDeleteAdminReviewVacancyMutation();
    const [editReview, { isLoading: isTogglingFeatured }] = useEditAdminReviewVacancyMutation();
    const { data: featuredCountData } = useGetAdminReviewVacanciesListQuery({
        page: 1,
        limit: 1,
        isFeatured: true,
    });
    const featuredCount = featuredCountData?.pagination.total ?? 0;

    useEffect(() => {
        const fetchData = async () => {
            setToast(undefined);
            try {
                await getReviews({
                    page: filters.page,
                    limit: REVIEWS_PER_PAGE,
                    sort: filters.sort ?? AdminSort.IdAsc,
                    authorFirstName: filters.authorFirstName,
                    authorLastName: filters.authorLastName,
                    vacancyName: filters.vacancyName,
                    isFeatured: filters.isFeatured === "true" ? true : undefined,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке отзывов",
                    type: HintType.Error,
                });
            }
        };
        fetchData();
    }, [filters.authorFirstName, filters.authorLastName,
        filters.isFeatured, filters.page, filters.sort, filters.vacancyName, getReviews]);

    const handleToggleFeatured = async (row: {
        id: string; rating: number; description: string; isFeatured: boolean;
    }) => {
        setToast(undefined);
        const nextValue = !row.isFeatured;

        if (isFeaturedCapReached(featuredCount, nextValue)) {
            setToast({
                text: `На главной уже выбрано максимум отзывов (${MAX_FEATURED_REVIEWS}). `
                    + "Уберите один, чтобы добавить другой.",
                type: HintType.Error,
            });
            return;
        }

        try {
            await editReview({
                reviewId: row.id,
                body: buildFeaturedEditBody(row, nextValue),
            }).unwrap();
            setToast({
                text: nextValue ? "Отзыв добавлен на главную страницу" : "Отзыв убран с главной страницы",
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: "Не удалось изменить показ отзыва на главной",
                type: HintType.Error,
            });
        }
    };

    const handleOpenDeleteModal = (id: string) => {
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
            field: "isFeatured",
            headerName: "На главной",
            width: 130,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            renderCell: (params) => (
                <Tooltip title={params.row.isFeatured ? "Убрать с главной" : "Показать на главной"}>
                    <span>
                        <Switch
                            checked={params.row.isFeatured}
                            disabled={isTogglingFeatured}
                            onChange={() => handleToggleFeatured(params.row)}
                        />
                    </span>
                </Tooltip>
            ),
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
                rating, description, created, authorId, isFeatured,
            } = review;
            return {
                id,
                authorId,
                name: getFullName(authorFirstName, authorLastName),
                vacancyName: textSlice(vacancyName, 50, "title"),
                rating,
                description,
                created,
                isFeatured,
            };
        });
        return (
            <DataGrid
                rows={adaptedData ?? []}
                columns={columns}
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
                hideFooter
            />
        );
    };

    const totalPages = () => {
        if (!reviewsData) return 0;
        return Math.ceil(reviewsData.pagination.total / REVIEWS_PER_PAGE);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h2>Таблица отзывов на вакансии</h2>
            <div className={styles.actionButtons}>
                <AdminFiltersTable
                    filters={filters}
                    onFilterChange={setFilters}
                    disabled={isLoading}
                    customFields={reviewVacancyCustomFields}
                />
                <span className={styles.featuredCounter}>
                    {`На главной: ${featuredCount} из ${MAX_FEATURED_REVIEWS}`}
                </span>
            </div>
            <div className={styles.table}>
                {renderTable()}
            </div>
            <OfferPagination
                currentPage={filters.page}
                totalPages={totalPages()}
                onPageChange={(newPage) => setFilters({ page: newPage })}
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
