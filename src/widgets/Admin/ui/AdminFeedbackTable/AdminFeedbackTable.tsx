import React, { useEffect, useState } from "react";
import {
    FormControl, InputLabel, MenuItem, Select, Stack,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import { getAdminFeedbackPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import {
    AdminSort, FeedbackStatus,
    useDeleteAdminFeedbackMutation, useLazyGetAdminFeedbackListQuery,
} from "@/entities/Admin";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { useQueryFilters } from "@/shared/hooks/usePaginationParams";
import styles from "./AdminFeedbackTable.module.scss";

const PER_PAGE = 30;

interface FeedbackFilters {
    sort?: AdminSort;
    status?: FeedbackStatus;
}

const STATUS_LABEL: Record<FeedbackStatus, string> = {
    [FeedbackStatus.New]: "Новое",
    [FeedbackStatus.Processed]: "Обработано",
};

const customFields: CustomFilterField<keyof FeedbackFilters>[] = [
    {
        key: "status",
        label: "Статус",
        render: ({ value, onChange, disabled }) => (
            <FormControl fullWidth size="small" disabled={disabled}>
                <InputLabel id="status-filter-label" sx={{ background: "background.paper", px: 0.5 }}>
                    Статус
                </InputLabel>
                <Select
                    labelId="status-filter-label"
                    value={value ?? ""}
                    label="Статус"
                    onChange={(e) => {
                        const raw = e.target.value;
                        onChange((raw || undefined) as FeedbackStatus | undefined);
                    }}
                >
                    <MenuItem value="">Все</MenuItem>
                    <MenuItem value={FeedbackStatus.New}>
                        {STATUS_LABEL[FeedbackStatus.New]}
                    </MenuItem>
                    <MenuItem value={FeedbackStatus.Processed}>
                        {STATUS_LABEL[FeedbackStatus.Processed]}
                    </MenuItem>
                </Select>
            </FormControl>
        ),
    },
    {
        key: "sort",
        label: "Сортировка",
        render: ({ value, onChange, disabled }) => (
            <FormControl fullWidth size="small" disabled={disabled}>
                <InputLabel id="feedback-sort-label" sx={{ background: "background.paper", px: 0.5 }}>
                    Сортировка
                </InputLabel>
                <Select
                    labelId="feedback-sort-label"
                    value={value || AdminSort.CreatedDesc}
                    label="Сортировка"
                    onChange={(e) => onChange(e.target.value as AdminSort)}
                >
                    <MenuItem value={AdminSort.CreatedDesc}>Дата ↓</MenuItem>
                    <MenuItem value={AdminSort.CreatedAsc}>Дата ↑</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

export const AdminFeedbackTable = () => {
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const {
        filters, setFilters,
    } = useQueryFilters({
        page: 1,
        sort: AdminSort.CreatedDesc,
        status: undefined as FeedbackStatus | undefined,
    });

    const [feedbackToDelete, setFeedbackToDelete] = useState<
    { id: string; } | null>(null);
    const [getFeedbackList, {
        data: feedbackData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminFeedbackListQuery();
    const [deleteFeedback, { isLoading: isDeleting }] = useDeleteAdminFeedbackMutation();

    useEffect(() => {
        const fetchData = async () => {
            setToast(undefined);
            try {
                await getFeedbackList({
                    page: filters.page,
                    limit: PER_PAGE,
                    sort: filters.sort ?? AdminSort.CreatedDesc,
                    status: filters.status,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке обращений",
                    type: HintType.Error,
                });
            }
        };

        fetchData();
    }, [filters.page, filters.sort, filters.status, getFeedbackList]);

    const handleOpenDeleteModal = (idValue: string) => {
        setFeedbackToDelete({ id: idValue });
    };

    const handleCloseDeleteModal = () => {
        setFeedbackToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!feedbackToDelete) return;

        try {
            await deleteFeedback(feedbackToDelete.id).unwrap();
            setToast({
                text: "Обращение было успешно удалено",
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
            field: "created",
            headerName: "Дата",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 140,
        },
        {
            field: "name",
            headerName: "Имя",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 160,
        },
        {
            field: "email",
            headerName: "E-mail",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 200,
        },
        {
            field: "message",
            headerName: "Сообщение",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 300,
        },
        {
            field: "status",
            headerName: "Статус",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 140,
            valueGetter: (params) => STATUS_LABEL[params.value as FeedbackStatus],
        },
        {
            field: "actions",
            headerName: "Действия",
            width: 120,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            renderCell: (params) => {
                const handleView = () => navigate(
                    getAdminFeedbackPersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Показать обращение"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить обращение"
                            className={cn(styles.btnIcon, styles.btnDelete)}
                            disabled={isDeleting}
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
        if (!feedbackData) {
            return <span>Обращений не найдено</span>;
        }
        return (
            <DataGrid
                rows={feedbackData.data}
                columns={columns}
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
                hideFooter
            />
        );
    };

    const totalPages = () => {
        if (!feedbackData) return 0;
        return Math.ceil(feedbackData.pagination.total / PER_PAGE);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <div className={styles.actionButtons}>
                <AdminFiltersTable
                    filters={filters}
                    onFilterChange={setFilters}
                    customFields={customFields}
                />
            </div>
            {renderTable()}
            <OfferPagination
                currentPage={filters.page}
                totalPages={totalPages()}
                onPageChange={(newPage) => setFilters({ page: newPage })}
            />
            <ConfirmActionModal
                isModalOpen={!!feedbackToDelete}
                description="Вы уверены, что хотите удалить это обращение? Это действие нельзя отменить."
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
