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
    AdminSort, useDeleteAdminOfferMutation, useLazyGetAdminOffersQuery,
} from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./AdminOffersTable.module.scss";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { getAdminVacancyWherePageUrl } from "@/shared/config/routes/AppUrls";

interface OfferFilters {
    userId?: string;
    organizationName?: string;
    vacancyName?: string;
    sort?: AdminSort;
}

const offerCustomFields: CustomFilterField<keyof OfferFilters>[] = [
    {
        key: "userId",
        label: "Поиск по id пользователя",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по id пользователя"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "organizationName",
        label: "Поиск по названию организации",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по названию организации"
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
        label: "Поиск по названию вакансии",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по названию вакансии"
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
                <InputLabel id="skill-sort-label" sx={{ background: "background.paper", px: 0.5 }}>
                    Сортировка
                </InputLabel>
                <Select
                    labelId="skill-sort-label"
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
                    <MenuItem value={AdminSort.UserIdAsc}>ID пользователя ↑</MenuItem>
                    <MenuItem value={AdminSort.UserIdDesc}>ID пользователя ↓</MenuItem>
                    <MenuItem value={AdminSort.OrganizationNameAsc}>
                        Название организации ↑
                    </MenuItem>
                    <MenuItem value={AdminSort.OrganizationNameDesc}>
                        Название организации ↓
                    </MenuItem>
                    <MenuItem value={AdminSort.NameAsc}>Название вакансии ↑</MenuItem>
                    <MenuItem value={AdminSort.NameDesc}>Название вакансии ↓</MenuItem>
                    <MenuItem value={AdminSort.IsActiveAsc}>Активность вакансии ↑</MenuItem>
                    <MenuItem value={AdminSort.IsActiveDesc}>Активность вакансии ↓</MenuItem>
                    <MenuItem value={AdminSort.TotalApplicationAsc}>Всего заявок ↑</MenuItem>
                    <MenuItem value={AdminSort.TotalApplicationDesc}>Всего заявок ↓</MenuItem>
                    <MenuItem value={AdminSort.AcceptApplicationAsc}>Принятых заявок ↑</MenuItem>
                    <MenuItem value={AdminSort.AcceptApplicationDesc}>Принятых заявок ↓</MenuItem>
                    <MenuItem value={AdminSort.CanselApplicationAsc}>Отменённых заявок ↑</MenuItem>
                    <MenuItem value={AdminSort.CanselApplicationDesc}>Отменённых заявок ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

const OFFERS_PER_PAGE = 30;

export const AdminOffersTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [offerToDelete, setOfferToDelete] = useState<
    { id: string; name: string } | null>(null);
    const [filters, setFilters] = useState<Partial<OfferFilters>>({});
    const [getOffers, {
        data: offersData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminOffersQuery();
    const [deleteOffer, { isLoading: isDeleting }] = useDeleteAdminOfferMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getOffers({
                    page: currentPage,
                    limit: OFFERS_PER_PAGE,
                    sort: filters.sort,
                    organizationName: filters.organizationName,
                    userId: filters.userId,
                    vacancyName: filters.vacancyName,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке вакансий",
                    type: HintType.Error,
                });
            }
        };
        fetchData();
    }, [currentPage, filters, getOffers]);

    const handleOpenDeleteModal = (id: string, name: string) => {
        setOfferToDelete({ id, name });
    };

    const handleCloseDeleteModal = () => {
        setOfferToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!offerToDelete) return;

        try {
            await deleteOffer(offerToDelete.id).unwrap();
            setToast({
                text: "Вакансия была успешна удалена",
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
            headerName: "Название",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "categoryName",
            headerName: "Категория",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "userId",
            headerName: "ID пользователя",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "organizationName",
            headerName: "Организация",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "isActive",
            headerName: "Опубликована",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
            type: "boolean",
        },
        {
            field: "countTotalApplication",
            headerName: "Заявок всего",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "countAcceptApplication",
            headerName: "Заявок принято",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "countCanselApplication",
            headerName: "Заявок отменено",
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
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать вакансию"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить вакансию"
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
        if (!offersData) {
            return <span className={styles.text}>Вакансии не были найдены</span>;
        }
        const adaptedData: any[] = offersData.data.map((offer) => {
            const {
                id, name, categoryName,
                organizationName, isActive, countTotalApplication,
                countAcceptApplication, countCanselApplication,
                user,
            } = offer;
            return {
                id,
                name,
                categoryName,
                userId: user.id,
                organizationName,
                isActive,
                countTotalApplication,
                countAcceptApplication,
                countCanselApplication,
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
        if (!offersData) return 0;
        return Math.ceil(offersData.pagination.total / OFFERS_PER_PAGE);
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
                    customFields={offerCustomFields}
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
                isModalOpen={!!offerToDelete}
                description={`Вы уверены, что хотите удалить вакансию "${offerToDelete?.name}"? Это действие нельзя отменить.`}
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
