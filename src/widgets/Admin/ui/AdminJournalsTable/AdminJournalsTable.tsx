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
    AdminSort, useDeleteAdminJournalMutation,
    useLazyGetAdminJournalListQuery,
} from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./AdminJournalsTable.module.scss";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { getAdminJournalCreatePageUrl, getAdminJournalPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

interface JournalFilters {
    name?: string;
    sort?: AdminSort;
}

const journalCustomFields: CustomFilterField<keyof JournalFilters>[] = [
    {
        key: "name",
        label: "Поиск по имени журнала",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по имени журнала"
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
                <InputLabel id="journal-sort-label" sx={{ background: "background.paper", px: 0.5 }}>
                    Сортировка
                </InputLabel>
                <Select
                    labelId="journal-sort-label"
                    value={value || AdminSort.IdAsc}
                    label="Сортировка"
                    onChange={(e) => onChange(e.target.value as AdminSort)}
                    MenuProps={{
                        PaperProps: {
                            style: { maxHeight: 200 },
                        },
                    }}
                >
                    <MenuItem value={AdminSort.NameAsc}>Название журнала ↑</MenuItem>
                    <MenuItem value={AdminSort.NameDesc}>Название журнала ↓</MenuItem>
                    <MenuItem value={AdminSort.IsActiveAsc}>Опубликован ↑</MenuItem>
                    <MenuItem value={AdminSort.IsActiveDesc}>Опубликован ↓</MenuItem>
                    <MenuItem value={AdminSort.ReviewsCountAsc}>Кол-во отзывов ↑</MenuItem>
                    <MenuItem value={AdminSort.ReviewsCountDesc}>Кол-во отзывов ↓</MenuItem>
                    <MenuItem value={AdminSort.CreatedAsc}>Дата ↑</MenuItem>
                    <MenuItem value={AdminSort.CreatedDesc}>Дата ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

const JOURNAL_PER_PAGE = 30;

export const AdminJournalsTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [journalToDelete, setJournalToDelete] = useState<
    { id: string; } | null>(null);
    const [filters, setFilters] = useState<Partial<JournalFilters>>(
        { sort: AdminSort.JournalNameAsc },
    );
    const [getJournal, {
        data: journalData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminJournalListQuery();
    const [deleteJournal, { isLoading: isDeleting }] = useDeleteAdminJournalMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getJournal({
                    page: currentPage,
                    limit: JOURNAL_PER_PAGE,
                    sort: filters.sort ?? AdminSort.JournalNameAsc,
                    name: filters.name,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке журналов",
                    type: HintType.Error,
                });
            }
        };
        fetchData();
    }, [currentPage, filters, getJournal]);

    const handleOpenDeleteModal = (id: string) => {
        setJournalToDelete({ id });
    };

    const handleCloseDeleteModal = () => {
        setJournalToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!journalToDelete) return;

        try {
            await deleteJournal(journalToDelete.id).unwrap();
            setToast({
                text: "Журнал был успешно удален",
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
            headerName: "Название журнала",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "isActive",
            headerName: "Опубликован",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
            type: "boolean",
        },
        {
            field: "reviewCount",
            headerName: "Кол-во комментариев",
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
                const handleView = () => navigate(
                    getAdminJournalPersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать журнал"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить журнал"
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
        if (!journalData) {
            return <span className={styles.text}>Журналы не были найдены</span>;
        }
        const adaptedData: any[] = journalData.data.map((journal) => {
            const {
                id, name,
                created, isActive, reviewCount,
            } = journal;
            return {
                id,
                name,
                isActive,
                reviewCount,
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
        if (!journalData) return 0;
        return Math.ceil(journalData.pagination.total / JOURNAL_PER_PAGE);
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <div className={styles.actionButtons}>
                <ButtonLink
                    type="primary"
                    className={styles.btn}
                    path={getAdminJournalCreatePageUrl(locale)}
                >
                    Добавить журнал
                </ButtonLink>
                <AdminFiltersTable
                    filters={filters}
                    onFilterChange={setFilters}
                    onApply={handleApplyFilters}
                    disabled={isLoading}
                    customFields={journalCustomFields}
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
                isModalOpen={!!journalToDelete}
                description={`Вы уверены, что хотите удалить журнал "${journalToDelete?.id}"? Это действие нельзя отменить.`}
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
