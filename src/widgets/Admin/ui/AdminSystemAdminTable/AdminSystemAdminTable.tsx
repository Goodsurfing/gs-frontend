import React, { useEffect, useState } from "react";
import {
    FormControl, InputLabel, MenuItem, Select, Stack, TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import { getAdminSystemAdminCreatePageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import {
    AdminSort, adminSystemAdminAdapter,
    useDeleteSystemAdminMutation, useLazyGetSystemAdminListQuery,
} from "@/entities/Admin";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { useQueryFilters } from "@/shared/hooks/usePaginationParams";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import styles from "./AdminSystemAdminTable.module.scss";

const PER_PAGE = 30;

interface SystemAdminFilters {
    sort?: AdminSort;
    firstName: string;
    lastName: string;
    email: string;
}

const customFields: CustomFilterField<keyof SystemAdminFilters>[] = [
    {
        key: "firstName",
        label: "Поиск по имени",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по имени"
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
        label: "Поиск по фамилии",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по фамилии"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "email",
        label: "Поиск по email",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по email"
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
                <InputLabel id="custom-sort-label" sx={{ background: "background.paper", px: 0.5 }}>
                    Сортировка
                </InputLabel>
                <Select
                    labelId="custom-sort-label"
                    value={value || AdminSort.IdAsc}
                    label="Сортировка"
                    onChange={(e) => onChange(e.target.value as AdminSort)}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 200,
                                width: "auto",
                            },
                        },
                    }}
                >
                    <MenuItem value={AdminSort.SortAsc}>ФИО ↑</MenuItem>
                    <MenuItem value={AdminSort.SortDesc}>ФИО ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

export const AdminSystemAdminTable = () => {
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const {
        filters, setFilters,
    } = useQueryFilters({
        firstName: "",
        lastName: "",
        email: "",
        page: 1,
        sort: AdminSort.FioDesc,
    });

    const [userToDelete, setUserToDelete] = useState<
    { id: string; name: string } | null>(null);
    const [getUsers, {
        data: usersData,
        isLoading,
        isFetching,
    }] = useLazyGetSystemAdminListQuery();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteSystemAdminMutation();

    useEffect(() => {
        const fetchData = async () => {
            setToast(undefined);
            try {
                await getUsers({
                    page: filters.page,
                    limit: PER_PAGE,
                    sort: filters.sort ?? AdminSort.FioDesc,
                    email: filters.email,
                    firstName: filters.firstName,
                    lastName: filters.lastName,
                }).unwrap();
            } catch (error) {
                setToast({
                    text: "Произошла ошибка при загрузке администраторов",
                    type: HintType.Error,
                });
            }
        };

        fetchData();
    }, [filters.email, filters.firstName,
        filters.lastName, filters.page, filters.sort, getUsers]);

    const handleOpenDeleteModal = (idValue: string, name: string) => {
        setUserToDelete({ id: idValue, name });
    };

    const handleCloseDeleteModal = () => {
        setUserToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!userToDelete) return;

        try {
            await deleteUser(userToDelete.id).unwrap();
            setToast({
                text: "Участник был успешно удален",
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
            width: 250,
        },
        {
            field: "name",
            headerName: "ФИО",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 250,
        },
        {
            field: "email",
            headerName: "Email",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 250,
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
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить администратора"
                            className={cn(styles.btnIcon, styles.btnDelete)}
                            disabled={isDeleting || params.row.isDelete}
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
        if (!usersData) {
            return <span>Администраторы не были найдены</span>;
        }
        return (
            <DataGrid
                rows={adminSystemAdminAdapter(usersData?.data)}
                columns={columns}
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
                hideFooter
            />
        );
    };

    const totalPages = () => {
        if (!usersData) return 0;
        return Math.ceil(usersData.pagination.total / PER_PAGE);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <div className={styles.actionButtons}>
                <ButtonLink
                    type="primary"
                    className={styles.btn}
                    path={getAdminSystemAdminCreatePageUrl(locale)}
                >
                    Добавить администратора
                </ButtonLink>
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
                isModalOpen={!!userToDelete}
                description={`Вы уверены, что хотите удалить пользователя "${userToDelete?.name}"? Это действие нельзя отменить.`}
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
