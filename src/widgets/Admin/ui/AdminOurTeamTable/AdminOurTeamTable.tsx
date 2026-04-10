import React, { useEffect, useState } from "react";
import {
    FormControl, InputLabel, MenuItem, Select, Stack,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import { getAdminOurTeamCreatePageUrl, getAdminOurTeamPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import {
    adminOurTeamAdapter,
    AdminSort, useDeleteAdminOurTeamMutation, useLazyGetAdminOurTeamListQuery,
} from "@/entities/Admin";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { useQueryFilters } from "@/shared/hooks/usePaginationParams";
import styles from "./AdminOurTeamTable.module.scss";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

const PER_PAGE = 30;

interface OurTeamFilters {
    sort?: AdminSort;
}

const customFields: CustomFilterField<keyof OurTeamFilters>[] = [
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
                    <MenuItem value={AdminSort.SortAsc}>Направление ↑</MenuItem>
                    <MenuItem value={AdminSort.SortDesc}>Направление ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

export const AdminOurTeamTable = () => {
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const {
        filters, setFilters,
    } = useQueryFilters({
        page: 1,
        sort: AdminSort.SortDesc,
    });

    const [userToDelete, setUserToDelete] = useState<
    { id: string; name: string } | null>(null);
    const [getUsers, {
        data: usersData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminOurTeamListQuery();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteAdminOurTeamMutation();

    useEffect(() => {
        const fetchData = async () => {
            setToast(undefined);
            try {
                await getUsers({
                    page: filters.page,
                    limit: PER_PAGE,
                    sort: filters.sort ?? AdminSort.SortDesc,
                }).unwrap();
            } catch (error) {
                setToast({
                    text: "Произошла ошибка при загрузке команды",
                    type: HintType.Error,
                });
            }
        };

        fetchData();
    }, [filters.page, filters.sort, getUsers]);

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
        },
        {
            field: "name",
            headerName: "ФИО",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 150,
        },
        {
            field: "position",
            headerName: "Позиция",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 150,
        },
        {
            field: "isFounder",
            headerName: "Основатель",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 150,
            type: "boolean",
        },
        {
            field: "sort",
            headerName: "Сортировка",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 140,
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
                    getAdminOurTeamPersonalPageUrl(locale, params.row.id),
                );

                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Показать участника"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить участника"
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
            return <span>Участников не было найдено</span>;
        }
        return (
            <DataGrid
                rows={adminOurTeamAdapter(usersData?.data)}
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
                    path={getAdminOurTeamCreatePageUrl(locale)}
                >
                    Добавить участника
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
