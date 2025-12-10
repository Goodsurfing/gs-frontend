import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ReactSVG } from "react-svg";
import {
    FormControl, InputLabel, MenuItem, Select, Stack, TextField,
} from "@mui/material";
import cn from "classnames";
import {
    adminOrganizationsAdapter,
    AdminSort, GetAdminOrganizationParams, useDeleteOrganizationMutation,
    useLazyGetOrganizationsQuery,
    useToggleAdminOrganizationActiveMutation,
} from "@/entities/Admin";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import blockIcon from "@/shared/assets/icons/admin/block.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminOrganizationsTable.module.scss";
import { getAdminPersonalOrganizationPageUrl } from "@/shared/config/routes/AppUrls";
import { AdminFiltersTable, CustomFilterField } from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

type OrganizationsFilters = Omit<Partial<GetAdminOrganizationParams>, "page" | "limit">;

const ORGANIZATIONS_PER_PAGE = 30;

const customFields: CustomFilterField<keyof OrganizationsFilters>[] = [
    {
        key: "name",
        label: "Название организации",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Название организации"
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

                    <MenuItem value={AdminSort.FioAsc}>ФИО ↑</MenuItem>
                    <MenuItem value={AdminSort.FioDesc}>ФИО ↓</MenuItem>

                    <MenuItem value={AdminSort.CreatedAsc}>Создан ↑</MenuItem>
                    <MenuItem value={AdminSort.CreatedDesc}>Создан ↓</MenuItem>

                    <MenuItem value={AdminSort.LastVisitAsc}>Сотрудники ↑</MenuItem>
                    <MenuItem value={AdminSort.LastVisitDesc}>Сотрудники ↓</MenuItem>

                    <MenuItem value={AdminSort.CountVacanciesAsc}>Кол-во вакансий ↑</MenuItem>
                    <MenuItem value={AdminSort.CountVacanciesDesc}>Кол-во вакансий ↓</MenuItem>

                    <MenuItem value={AdminSort.CountApplicationsAsc}>Кол-во заявок ↑</MenuItem>
                    <MenuItem value={AdminSort.CountApplicationsDesc}>Кол-во заявок ↓</MenuItem>

                    <MenuItem value={AdminSort.IsOrganizationAsc}>Организация ↑</MenuItem>
                    <MenuItem value={AdminSort.IsOrganizationDesc}>Организация ↓</MenuItem>

                </Select>
            </FormControl>
        ),
    },
];

export const AdminOrganizationsTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [filters, setFilters] = useState<Partial<OrganizationsFilters>>({
        sort: AdminSort.IdAsc,
    });
    const [toggleAdminOrganizationActive,
        { isLoading: isTogglingActive }] = useToggleAdminOrganizationActiveMutation();
    const [organizationToDelete, setOrganizationToDelete] = useState<
    { id: string; name: string } | null>(null);
    const [getOrganizations, {
        data: organizationsData,
        isLoading,
        isFetching,
    }] = useLazyGetOrganizationsQuery();
    const [organizationToToggle, setOrganizationToToggle] = useState<{ id: number;
        isActive: boolean; name: string } | null>(null);
    const [deleteOrganization, { isLoading: isDeleting }] = useDeleteOrganizationMutation();

    useEffect(() => {
        const fetchData = async () => {
            setToast(undefined);
            try {
                await getOrganizations({
                    page: currentPage,
                    limit: ORGANIZATIONS_PER_PAGE,
                    sort: filters.sort ?? AdminSort.IdAsc,
                    firstName: filters.firstName,
                    lastName: filters.lastName,
                    name: filters.name,
                }).unwrap();
            } catch (error) {
                setToast({
                    text: "Произошла ошибка при загрузке организаций",
                    type: HintType.Error,
                });
            }
        };

        fetchData();
    }, [currentPage, filters, getOrganizations]);

    const handleOpenDeleteModal = (id: string, name: string) => {
        setOrganizationToDelete({ id, name });
    };

    const handleCloseDeleteModal = () => {
        setOrganizationToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!organizationToDelete) return;

        try {
            await deleteOrganization(organizationToDelete.id).unwrap();
            setToast({
                text: "Организация была успешно удалена",
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

    const handleOpenToggleModal = (id: number, isActive: boolean, name: string) => {
        setOrganizationToToggle({ id, isActive, name });
    };

    const handleCloseToggleModal = () => {
        setOrganizationToToggle(null);
    };

    const handleConfirmToggle = async () => {
        if (!organizationToToggle) return;

        try {
            await toggleAdminOrganizationActive(organizationToToggle.id.toString()).unwrap();
            setToast({
                text: `Организация успешно ${
                    organizationToToggle.isActive ? "заблокирована" : "разблокирована"
                }`,
                type: HintType.Success,
            });
        } catch (error) {
            setToast({
                text: `Ошибка при ${
                    organizationToToggle.isActive ? "блокировке" : "разблокировке"
                } организации`,
                type: HintType.Error,
            });
        } finally {
            handleCloseToggleModal();
        }
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", disableColumnMenu: false },
        {
            field: "name", headerName: "Название", disableColumnMenu: false, width: 240,
        },
        {
            field: "owner",
            headerName: "Владелец",
            sortable: false,
            filterable: true,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "countMembers",
            headerName: "Кол-во участников",
            type: "number",
            sortable: true,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "countVacancies",
            headerName: "Кол-во вакансий",
            type: "number",
            sortable: true,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "countVolunteers",
            headerName: "Кол-вл гудсёрферов",
            type: "number",
            sortable: true,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "isActive",
            headerName: "Активная организация",
            type: "boolean",
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
                    getAdminPersonalOrganizationPageUrl(locale, params.row.id),
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
                            title="Показать организацию"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleToggleActiveClick}
                            type="button"
                            title={isActive ? "Заблокировать организацию" : "Разблокировать организацию"}
                            className={cn(styles.btnIcon, isActive
                                ? styles.btnBlock : styles.btnUnblock)}
                            disabled={isTogglingActive}
                        >
                            <ReactSVG src={blockIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить организацию"
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
        if (!organizationsData) {
            return <span className={styles.text}>Пользователей не было найдено</span>;
        }
        return (
            <DataGrid
                rows={adminOrganizationsAdapter(organizationsData?.data)}
                columns={columns}
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
            />
        );
    };

    const totalPages = () => {
        if (!organizationsData) return 0;
        return Math.ceil(organizationsData.pagination.total / ORGANIZATIONS_PER_PAGE);
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <AdminFiltersTable
                filters={filters}
                onFilterChange={setFilters}
                onApply={handleApplyFilters}
                customFields={customFields}
            />
            {renderTable()}
            <OfferPagination
                currentPage={currentPage}
                totalPages={totalPages()}
                onPageChange={setCurrentPage}
            />
            <ConfirmActionModal
                isModalOpen={!!organizationToDelete}
                description={`Вы уверены, что хотите удалить организацию "${organizationToDelete?.name}"? Это действие нельзя отменить.`}
                onConfirm={handleConfirmDelete}
                onClose={handleCloseDeleteModal}
                confirmTextButton="Удалить"
                cancelTextButton="Отмена"
                isLoading={isDeleting}
                buttonsDisabled={isDeleting}
            />
            <ConfirmActionModal
                isModalOpen={!!organizationToToggle}
                description={`Вы уверены, что хотите ${organizationToToggle?.isActive
                    ? "заблокировать" : "разблокировать"} организацию "${organizationToToggle?.name}"?`}
                onConfirm={handleConfirmToggle}
                onClose={handleCloseToggleModal}
                confirmTextButton={organizationToToggle?.isActive ? "Заблокировать" : "Разблокировать"}
                cancelTextButton="Отмена"
                isLoading={isTogglingActive}
                buttonsDisabled={isTogglingActive}
            />
        </div>
    );
};
