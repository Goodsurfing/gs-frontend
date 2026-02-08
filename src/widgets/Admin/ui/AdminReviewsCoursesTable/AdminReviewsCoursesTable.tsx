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
import {
    AdminSort, useDeleteAdminReviewCourseMutation,
    useLazyGetAdminReviewsCoursesQuery,
} from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./AdminReviewsCoursesTable.module.scss";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { getAdminVacancyWherePageUrl } from "@/shared/config/routes/AppUrls";
import { getFullName } from "@/shared/lib/getFullName";

interface ReviewCourseFilters {
    name?: string;
    author?: string;
    sort?: AdminSort;
}

const reviewCourseCustomFields: CustomFilterField<keyof ReviewCourseFilters>[] = [
    {
        key: "name",
        label: "Поиск по названию курса",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по названию курса"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "author",
        label: "Поиск по имени автора",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по имени автора"
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
                    <MenuItem value={AdminSort.VacancyIdAsc}>ID ↑</MenuItem>
                    <MenuItem value={AdminSort.VacancyIdDesc}>ID ↓</MenuItem>
                    <MenuItem value={AdminSort.CategoryNameAsc}>ФИО ↑</MenuItem>
                    <MenuItem value={AdminSort.CategoryNameDesc}>ФИО ↓</MenuItem>
                    <MenuItem value={AdminSort.UserIdAsc}>Название курса ↑</MenuItem>
                    <MenuItem value={AdminSort.UserIdDesc}>Название курса ↓</MenuItem>
                    <MenuItem value={AdminSort.OrganizationNameAsc}>
                        Рейтинг ↑
                    </MenuItem>
                    <MenuItem value={AdminSort.OrganizationNameDesc}>
                        Рейтинг ↓
                    </MenuItem>
                    <MenuItem value={AdminSort.VacancyNameAsc}>Содержание отзыва ↑</MenuItem>
                    <MenuItem value={AdminSort.VacancyNameDesc}>Содержание отзыва ↓</MenuItem>
                    <MenuItem value={AdminSort.VacancyStatusAsc}>Дата ↑</MenuItem>
                    <MenuItem value={AdminSort.VacancyStatusDesc}>Дата ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

const REVIEWS_COURSES_PER_PAGE = 30;

export const AdminReviewsCoursesTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [reviewToDelete, setReviewToDelete] = useState<
    { id: number; } | null>(null);
    const [filters, setFilters] = useState<Partial<ReviewCourseFilters>>(
        { sort: AdminSort.VacancyIdDesc },
    );
    const [getReviews, {
        data: reviewsData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminReviewsCoursesQuery();
    const [deleteReview, { isLoading: isDeleting }] = useDeleteAdminReviewCourseMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getReviews({
                    page: currentPage,
                    limit: REVIEWS_COURSES_PER_PAGE,
                    sort: filters.sort ?? AdminSort.VacancyIdDesc,
                    author: filters.author,
                    name: filters.name,
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
                text: "Курс был успешно удалён",
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
            field: "author",
            headerName: "ФИО",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "name",
            headerName: "Название курса",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
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
            headerName: "Отзыв",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "date",
            headerName: "Опубликована",
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
                const handleView = () => navigate(
                    getAdminVacancyWherePageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать отзыв"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
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
                id, name, authorFirstName, authorLastName,
                rating, description, date,
            } = review;
            return {
                id,
                author: getFullName(authorFirstName, authorLastName),
                name,
                rating,
                description,
                date,
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
        return Math.ceil(reviewsData.pagination.total / REVIEWS_COURSES_PER_PAGE);
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <div className={styles.actionButtons}>
                <AdminFiltersTable
                    filters={filters}
                    onFilterChange={setFilters}
                    onApply={handleApplyFilters}
                    disabled={isLoading}
                    customFields={reviewCourseCustomFields}
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
                description={`Вы уверены, что хотите удалить вакансию "${reviewToDelete?.id}"? Это действие нельзя отменить.`}
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
