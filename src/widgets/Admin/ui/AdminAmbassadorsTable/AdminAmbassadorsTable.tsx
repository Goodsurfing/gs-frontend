import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    FormControl, InputLabel, MenuItem, Select, Stack, TextField,
} from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import editIcon from "@/shared/assets/icons/admin/edit.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    adminAmbassadorsAdapter,
    AdminSort, useDeleteAdminAmbassadorMutation, useLazyGetAdminAmbassadorsQuery,
} from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { getAdminAmbassadorCreatePageUrl, getAdminAmbassadorPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useQueryFilters } from "@/shared/hooks/usePaginationParams";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import styles from "./AdminAmbassadorsTable.module.scss";

interface AmbassadorsFilters {
    id?: string;
    firstName?: string;
    lastName?: string;
    description?: string;
    city?: string;
    country?: string;
    sort?: AdminSort;
}

const ambassadorsCustomFields: CustomFilterField<keyof AmbassadorsFilters>[] = [
    {
        key: "id",
        label: "Поиск по id",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по id"
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
        label: "Поиск по имени пользователя",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по имени пользователя"
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
        label: "Поиск по фамилии пользователя",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по фамилии пользователя"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "description",
        label: "Поиск по описанию",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по описанию"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "city",
        label: "Поиск по городу",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по городу"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "country",
        label: "Поиск по стране",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по стране"
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
                <InputLabel id="ambassador-sort-label" sx={{ background: "background.paper", px: 0.5 }}>
                    Сортировка
                </InputLabel>
                <Select
                    labelId="ambassador-sort-label"
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
                    <MenuItem value={AdminSort.CategoryNameAsc}>Категории ↑</MenuItem>
                    <MenuItem value={AdminSort.CategoryNameDesc}>Категории ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

const AMBASSADORS_PER_PAGE = 30;

export const AdminAmbassadorsTable = () => {
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [ambassadorToDelete, setAmbassadorToDelete] = useState<
    { id: number; name: string } | null>(null);
    const {
        filters, setFilters,
    } = useQueryFilters({
        page: 1,
        sort: AdminSort.IdDesc,
        firstName: undefined,
        lastName: undefined,
        description: undefined,
        city: undefined,
        country: undefined,
        id: undefined,
    });

    const [getAmbassadors, {
        data: ambassadorsData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminAmbassadorsQuery();
    const [deleteAmbassador, { isLoading: isDeleting }] = useDeleteAdminAmbassadorMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getAmbassadors({
                    page: filters.page,
                    limit: AMBASSADORS_PER_PAGE,
                    sort: filters.sort ?? AdminSort.IdDesc,
                    firstName: filters.firstName,
                    lastName: filters.lastName,
                    city: filters.city,
                    country: filters.country,
                    description: filters.description,
                    id: filters.id,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке амбассадоров",
                    type: HintType.Error,
                });
            }
        };
        fetchData();
    }, [filters.city, filters.country,
        filters.description, filters.firstName, filters.id,
        filters.lastName, filters.page, filters.sort, getAmbassadors]);

    const handleOpenDeleteModal = (id: number, name: string) => {
        setAmbassadorToDelete({ id, name });
    };

    const handleCloseDeleteModal = () => {
        setAmbassadorToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!ambassadorToDelete) return;

        try {
            await deleteAmbassador(ambassadorToDelete.id).unwrap();
            setToast({
                text: "Амбассадор был успешно удален",
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
            headerName: "ФИО",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "description",
            headerName: "Описание",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "address",
            headerName: "Адрес",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "sort",
            headerName: "Сортировка",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "image",
            headerName: "Фотография",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
            renderCell: (params) => (
                <img
                    className={styles.img}
                    src={params.row.image}
                    alt={params.row.image}
                />
            ),
        },
        {
            field: "actions",
            headerName: "Действия",
            width: 220,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            renderCell: (params) => {
                const handleEdit = () => navigate(
                    getAdminAmbassadorPersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleEdit}
                            type="button"
                            title="Редактировать абмассадора"
                            className={cn(styles.btnIcon, styles.btnEdit)}
                        >
                            <ReactSVG src={editIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить абмассадора"
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
        if (!ambassadorsData) {
            return <span>Абмассадоры не были найдены</span>;
        }
        const adaptedData: any[] = adminAmbassadorsAdapter(ambassadorsData.data);
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
        if (!ambassadorsData) return 0;
        return Math.ceil(ambassadorsData.pagination.total / AMBASSADORS_PER_PAGE);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <div className={styles.actionButtons}>
                <ButtonLink
                    type="primary"
                    className={styles.btn}
                    path={getAdminAmbassadorCreatePageUrl(locale)}
                >
                    Добавить навык
                </ButtonLink>
                <AdminFiltersTable
                    filters={filters}
                    onFilterChange={setFilters}
                    disabled={isLoading}
                    customFields={ambassadorsCustomFields}
                />
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
                isModalOpen={!!ambassadorToDelete}
                description={`Вы уверены, что хотите удалить вакансию "${ambassadorToDelete?.name}"? Это действие нельзя отменить.`}
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
