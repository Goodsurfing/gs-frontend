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
import { getAdminReviewVideoPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import {
    AdminSort,
    useDeleteAdminReviewVideoMutation,
    useLazyGetAdminReviewsVideoQuery,
} from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import styles from "./AdminReviewsVideoTable.module.scss";

interface ReviewFilters {
    videoId?: string;
    firstName?: string;
    lastName?: string;
    videoName?: string;
    sort?: AdminSort;
}

const reviewCustomFields: CustomFilterField<keyof ReviewFilters>[] = [
    {
        key: "videoId",
        label: "ID видео",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="ID видео"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "videoName",
        label: "Название видео",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Название видео"
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
        label: "Имя автора",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Название журнала"
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
        key: "sort",
        label: "Сортировка",
        render: ({ value, onChange, disabled }) => (
            <FormControl fullWidth size="small" disabled={disabled}>
                <InputLabel id="review-sort-label" sx={{ background: "background.paper", px: 0.5 }}>
                    Сортировка
                </InputLabel>
                <Select
                    labelId="review-sort-label"
                    value={value || AdminSort.FioAsc}
                    label="Сортировка"
                    onChange={(e) => onChange(e.target.value as AdminSort)}
                    MenuProps={{
                        PaperProps: {
                            style: { maxHeight: 200 },
                        },
                    }}
                >
                    <MenuItem value={AdminSort.FioAsc}>ФИО автора ↑</MenuItem>
                    <MenuItem value={AdminSort.FioDesc}>ФИО автора ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

const REVIEWS_PER_PAGE = 30;

export const AdminReviewsVideoTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [reviewToDelete, setReviewToDelete] = useState<
    { id: string; } | null>(null);
    const [filters, setFilters] = useState<Partial<ReviewFilters>>({
        sort: AdminSort.FioAsc,
    });
    const [getReviews, {
        data: reviewsData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminReviewsVideoQuery();
    const [deleteReview, { isLoading: isDeleting }] = useDeleteAdminReviewVideoMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getReviews({
                    page: currentPage,
                    limit: REVIEWS_PER_PAGE,
                    sort: filters.sort,
                    firstName: filters.firstName,
                    lastName: filters.lastName,
                    videoId: filters.videoId,
                    videoName: filters.videoName,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке комментариев",
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
            field: "videoName",
            headerName: "Видео",
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
            field: "created",
            headerName: "Дата",
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
                    getAdminReviewVideoPersonalPageUrl(locale, params.row.id),
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
            journalName: review.video.name,
            isActive: review.isActive,
            created: review.created,
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
