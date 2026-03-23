import React, { useEffect, useState } from "react";
import {
    FormControl, InputLabel, MenuItem, Select, Stack,
    TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import { getAdminPersonalUserPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

import showIcon from "@/shared/assets/icons/admin/show.svg";
import blockIcon from "@/shared/assets/icons/admin/block.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import {
    AdminSort, adminUsersAdapter, useDeleteUserMutation, useLazyGetUsersQuery,
    useToggleAdminUserActiveMutation,
} from "@/entities/Admin";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { useQueryFilters } from "@/shared/hooks/usePaginationParams";
import styles from "./AdminUsersTable.module.scss";

const USERS_PER_PAGE = 30;

interface UserFilters {
    id?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    sort?: AdminSort;
}

const customFields: CustomFilterField<keyof UserFilters>[] = [
    {
        key: "id",
        label: "ID",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="ID"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                inputProps={{ min: 1, step: 1 }}
                disabled={disabled}
            />
        ),
    },
    {
        key: "email",
        label: "Email",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Email"
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
        label: "Имя",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Имя"
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
        label: "Фамилия",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Фамилия"
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
                    <MenuItem value={AdminSort.IdAsc}>ID ↑</MenuItem>
                    <MenuItem value={AdminSort.IdDesc}>ID ↓</MenuItem>

                    <MenuItem value={AdminSort.NameAsc}>Название ↑</MenuItem>
                    <MenuItem value={AdminSort.NameDesc}>Название ↓</MenuItem>

                    <MenuItem value={AdminSort.EmailAsc}>Email ↑</MenuItem>
                    <MenuItem value={AdminSort.EmailDesc}>Email ↓</MenuItem>

                    <MenuItem value={AdminSort.FioAsc}>ФИО ↑</MenuItem>
                    <MenuItem value={AdminSort.FioDesc}>ФИО ↓</MenuItem>

                    <MenuItem value={AdminSort.CreatedAsc}>Создан ↑</MenuItem>
                    <MenuItem value={AdminSort.CreatedDesc}>Создан ↓</MenuItem>

                    <MenuItem value={AdminSort.LastVisitAsc}>Последний визит ↑</MenuItem>
                    <MenuItem value={AdminSort.LastVisitDesc}>Последний визит ↓</MenuItem>

                    <MenuItem value={AdminSort.IsVerifiedAsc}>Верифицирован ↑</MenuItem>
                    <MenuItem value={AdminSort.IsVerifiedDesc}>Верифицирован ↓</MenuItem>

                    <MenuItem value={AdminSort.IsVolunteerAsc}>Гудсёрфер ↑</MenuItem>
                    <MenuItem value={AdminSort.IsVolunteerDesc}>Гудсёрфер ↓</MenuItem>

                    <MenuItem value={AdminSort.IsOrganizationAsc}>Организация ↑</MenuItem>
                    <MenuItem value={AdminSort.IsOrganizationDesc}>Организация ↓</MenuItem>

                    <MenuItem value={AdminSort.IsActiveAsc}>Активен ↑</MenuItem>
                    <MenuItem value={AdminSort.IsActiveDesc}>Активен ↓</MenuItem>

                    <MenuItem value={AdminSort.IsPaymentAsc}>Платёж ↑</MenuItem>
                    <MenuItem value={AdminSort.IsPaymentDesc}>Платёж ↓</MenuItem>

                    <MenuItem value={AdminSort.IsEndPaymentAsc}>Окончание платежа ↑</MenuItem>
                    <MenuItem value={AdminSort.IsEndPaymentDesc}>Окончание платежа ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

export const AdminUsersTable = () => {
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const {
        filters, setFilters,
    } = useQueryFilters({
        page: 1,
        id: undefined,
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        sort: AdminSort.IdAsc,
    });

    const [userToDelete, setUserToDelete] = useState<
    { id: string; name: string } | null>(null);
    const [getUsers, {
        data: usersData,
        isLoading,
        isFetching,
    }] = useLazyGetUsersQuery();
    const [userToToggle, setUserToToggle] = useState<{ id: number;
        isActive: boolean; name: string } | null>(null);
    const [toggleAdminUserActive,
        { isLoading: isTogglingActive }] = useToggleAdminUserActiveMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    useEffect(() => {
        const fetchData = async () => {
            setToast(undefined);
            try {
                await getUsers({
                    page: filters.page,
                    limit: USERS_PER_PAGE,
                    id: filters.id,
                    email: filters.email,
                    firstName: filters.firstName,
                    lastName: filters.lastName,
                    sort: filters.sort ?? AdminSort.IdAsc,
                }).unwrap();
            } catch (error) {
                setToast({
                    text: "Произошла ошибка при загрузке пользователей",
                    type: HintType.Error,
                });
            }
        };

        fetchData();
    }, [filters.email, filters.firstName, filters.id,
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
                text: "Пользователь был успешно удален",
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

    const handleOpenToggleModal = (idValue: number, isActive: boolean, name: string) => {
        setUserToToggle({ id: idValue, isActive, name });
    };

    const handleCloseToggleModal = () => {
        setUserToToggle(null);
    };

    const handleConfirmToggle = async () => {
        if (!userToToggle) return;

        try {
            await toggleAdminUserActive({
                id: userToToggle.id.toString(),
                isActive: !userToToggle.isActive,
            }).unwrap();
            setToast({
                text: `Пользователь успешно ${
                    userToToggle.isActive ? "заблокирован" : "разблокирован"
                }`,
                type: HintType.Success,
            });
        } catch (error) {
            setToast({
                text: `Ошибка при ${
                    userToToggle.isActive ? "блокировке" : "разблокировке"
                } пользователя`,
                type: HintType.Error,
            });
        } finally {
            handleCloseToggleModal();
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
            field: "email",
            headerName: "E-mail",
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
            field: "isDelete",
            headerName: "Удалён",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 150,
            type: "boolean",
        },
        {
            field: "dateRegistration",
            headerName: "Дата регистрации",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 140,
        },
        {
            field: "dateLogin",
            headerName: "Дата последнего входа",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 140,
        },
        {
            field: "isConfirmed",
            headerName: "Подтвержден",
            type: "boolean",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
        {
            field: "isVolunteer",
            headerName: "Роль \"Гудсёрфер\"",
            type: "boolean",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
        {
            field: "isHost",
            headerName: "Роль \"Хост\"",
            type: "boolean",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
        {
            field: "isActive",
            headerName: "Активный аккаунт",
            type: "boolean",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
        {
            field: "isMembership",
            headerName: "Членство",
            type: "boolean",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
        {
            field: "dataEndMembership",
            headerName: "Окончание членства",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
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
                const isActive = params.row.isActive === true;

                const handleView = () => navigate(
                    getAdminPersonalUserPageUrl(locale, params.row.id),
                );
                const handleToggleActiveClick = () => handleOpenToggleModal(
                    params.row.id,
                    isActive,
                    params.row.name,
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Показать пользователя"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleToggleActiveClick}
                            type="button"
                            title={isActive ? "Заблокировать пользователя" : "Разблокировать пользователя"}
                            className={cn(styles.btnIcon, isActive
                                ? styles.btnBlock : styles.btnUnblock)}
                            disabled={isTogglingActive}
                        >
                            <ReactSVG src={blockIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить пользователя"
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
            return <span className={styles.text}>Пользователей не было найдено</span>;
        }
        return (
            <DataGrid
                rows={adminUsersAdapter(usersData?.data)}
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
        return Math.ceil(usersData.pagination.total / USERS_PER_PAGE);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <AdminFiltersTable
                filters={filters}
                onFilterChange={setFilters}
                customFields={customFields}
            />
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
            <ConfirmActionModal
                isModalOpen={!!userToToggle}
                description={`Вы уверены, что хотите ${userToToggle?.isActive
                    ? "заблокировать" : "разблокировать"} пользователя "${userToToggle?.name}"?`}
                onConfirm={handleConfirmToggle}
                onClose={handleCloseToggleModal}
                confirmTextButton={userToToggle?.isActive ? "Заблокировать" : "Разблокировать"}
                cancelTextButton="Отмена"
                isLoading={isTogglingActive}
                buttonsDisabled={isTogglingActive}
            />
        </div>
    );
};
