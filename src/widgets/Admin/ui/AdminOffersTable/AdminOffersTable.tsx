import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    FormControl, InputLabel, MenuItem, Select, Stack, TextField,
} from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import editIcon from "@/shared/assets/icons/admin/edit.svg";
import publishIcon from "@/shared/assets/icons/admin/publish.svg";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    AdminSort, useDeleteAdminOfferMutation, useLazyGetAdminOffersQuery,
    useUpdateAdminVacancyStatusMutation,
} from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { getAdminVacancyWherePageUrl, getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useQueryFilters } from "@/shared/hooks/usePaginationParams";
import styles from "./AdminOffersTable.module.scss";

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
                    <MenuItem value={AdminSort.VacancyIdAsc}>ID ↑</MenuItem>
                    <MenuItem value={AdminSort.VacancyIdDesc}>ID ↓</MenuItem>
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
                    <MenuItem value={AdminSort.VacancyNameAsc}>Название вакансии ↑</MenuItem>
                    <MenuItem value={AdminSort.VacancyNameDesc}>Название вакансии ↓</MenuItem>
                    <MenuItem value={AdminSort.VacancyStatusAsc}>Активность вакансии ↑</MenuItem>
                    <MenuItem value={AdminSort.VacancyStatusDesc}>Активность вакансии ↓</MenuItem>
                    <MenuItem value={AdminSort.CountApplicationAsc}>Всего заявок ↑</MenuItem>
                    <MenuItem value={AdminSort.CountApplicationDesc}>Всего заявок ↓</MenuItem>
                    <MenuItem value={AdminSort.CountAcceptedApplicationAsc}>
                        Принятых заявок ↑
                    </MenuItem>
                    <MenuItem value={AdminSort.CountAcceptedApplicationDesc}>
                        Принятых заявок ↓
                    </MenuItem>
                    <MenuItem value={AdminSort.CountCanceledApplicationAsc}>
                        Отменённых заявок ↑
                    </MenuItem>
                    <MenuItem value={AdminSort.CountCanceledApplicationDesc}>
                        Отменённых заявок ↓
                    </MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

const OFFERS_PER_PAGE = 30;

export const AdminOffersTable = () => {
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [offerToDelete, setOfferToDelete] = useState<
    { id: string; name: string } | null>(null);
    const [offerToPublish, setOfferToPublish] = useState<
    { id: string; name: string, isActive: boolean } | null>(null);
    const {
        filters, setFilters,
    } = useQueryFilters({
        page: 1,
        sort: AdminSort.VacancyIdDesc,
        organizationName: undefined,
        userId: undefined,
        vacancyName: undefined,
    });

    const [getOffers, {
        data: offersData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminOffersQuery();
    const [deleteOffer, { isLoading: isDeleting }] = useDeleteAdminOfferMutation();
    const [publishOffer, { isLoading: isPublishing }] = useUpdateAdminVacancyStatusMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getOffers({
                    page: filters.page,
                    limit: OFFERS_PER_PAGE,
                    sort: filters.sort ?? AdminSort.VacancyIdDesc,
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
    }, [filters.organizationName, filters.page, filters.sort,
        filters.userId, filters.vacancyName, getOffers]);

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

    const handleOpenPublishModal = (id: string, name: string, isActive: boolean) => {
        setOfferToPublish({ id, name, isActive });
    };

    const handleClosePublishModal = () => {
        setOfferToPublish(null);
    };

    const handleConfirmPublish = async () => {
        setToast(undefined);
        if (!offerToPublish) return;

        try {
            await publishOffer({
                id: offerToPublish.id,
                status: offerToPublish.isActive ? "draft" : "active",
            }).unwrap();
            setToast({
                text: `Вакансия была успешна ${offerToPublish.isActive ? "распубликована" : "опубликована"}`,
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: `Произошла ошибка при удалении ${offerToPublish.isActive ? "распубликации" : "публикации"}`,
                type: HintType.Error,
            });
        } finally {
            handleClosePublishModal();
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
            width: 220,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            renderCell: (params) => {
                const handleView = () => navigate(
                    getOfferPersonalPageUrl(locale, params.row.id),
                );
                const handleEdit = () => navigate(
                    getAdminVacancyWherePageUrl(locale, params.row.id),
                );
                const handlePublish = () => handleOpenPublishModal(
                    params.row.id,
                    params.row.name || `ID: ${params.row.id}`,
                    params.row.isActive,
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Посмотреть вакансию"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleEdit}
                            type="button"
                            title="Редактировать вакансию"
                            className={cn(styles.btnIcon, styles.btnEdit)}
                        >
                            <ReactSVG src={editIcon} />
                        </button>
                        <button
                            onClick={handlePublish}
                            type="button"
                            title={params.row.isActive ? "Распубликовать вакансию" : "Опубликовать вакансию"}
                            className={cn(
                                styles.btnIcon,
                                styles.btnPublish,
                                { [styles.active]: !params.row.isActive },
                            )}
                        >
                            <ReactSVG src={publishIcon} />
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
                id, name, categories,
                organizationName, status, countTotalApplication,
                countAcceptApplication, countCanselApplication,
                user,
            } = offer;
            return {
                id,
                name,
                categoryName: categories[0]?.name,
                userId: user.id,
                organizationName,
                isActive: status === "active" || status === "disabled",
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
                hideFooter
            />
        );
    };

    const totalPages = () => {
        if (!offersData) return 0;
        return Math.ceil(offersData.pagination.total / OFFERS_PER_PAGE);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <div className={styles.actionButtons}>
                <AdminFiltersTable
                    filters={filters}
                    onFilterChange={setFilters}
                    disabled={isLoading}
                    customFields={offerCustomFields}
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
                isModalOpen={!!offerToDelete}
                description={`Вы уверены, что хотите удалить вакансию "${offerToDelete?.name}"? Это действие нельзя отменить.`}
                onConfirm={handleConfirmDelete}
                onClose={handleCloseDeleteModal}
                confirmTextButton="Удалить"
                cancelTextButton="Отмена"
                isLoading={isDeleting}
                buttonsDisabled={isDeleting}
            />
            <ConfirmActionModal
                isModalOpen={!!offerToPublish}
                description={`Вы уверены, что хотите "${offerToPublish?.isActive ? "распубликовать" : "опубликовать"}" вакансию "${offerToPublish?.name}"? Это действие нельзя отменить.`}
                onConfirm={handleConfirmPublish}
                onClose={handleClosePublishModal}
                confirmTextButton={offerToPublish?.isActive ? "Распубликовать" : "Опубликовать"}
                cancelTextButton="Отмена"
                isLoading={isPublishing}
                buttonsDisabled={isPublishing}
            />
        </div>
    );
};
