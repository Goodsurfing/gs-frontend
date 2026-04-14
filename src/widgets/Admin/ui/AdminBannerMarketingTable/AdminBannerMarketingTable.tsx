import React, { useEffect, useState } from "react";
import {
    FormControl, InputLabel, MenuItem, Select, Stack,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import { getAdminBannerMarketingCreatePageUrl, getAdminBannerMarketingPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import {
    adminBannerMarketingListAdapter,
    AdminSort, useDeleteAdminBannerMarketingMutation, useLazyGetAdminBannerMarketingListQuery,
} from "@/entities/Admin";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { useQueryFilters } from "@/shared/hooks/usePaginationParams";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import styles from "./AdminBannerMarketingTable.module.scss";

const PER_PAGE = 30;

interface BannerMarketingFilters {
    sort?: AdminSort;
}

const customFields: CustomFilterField<keyof BannerMarketingFilters>[] = [
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
                    <MenuItem value={AdminSort.TypeAsc}>Формат баннера ↑</MenuItem>
                    <MenuItem value={AdminSort.TypeDesc}>Формат баннера ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

export const AdminBannerMarketingTable = () => {
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const {
        filters, setFilters,
    } = useQueryFilters({
        page: 1,
        sort: AdminSort.TypeDesc,
    });

    const [bannerToDelete, setBannerToDelete] = useState<
    { id: string; } | null>(null);
    const [getBanners, {
        data: bannersData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminBannerMarketingListQuery();
    const [deleteBanner, { isLoading: isDeleting }] = useDeleteAdminBannerMarketingMutation();

    useEffect(() => {
        const fetchData = async () => {
            setToast(undefined);
            try {
                await getBanners({
                    page: filters.page,
                    limit: PER_PAGE,
                    sort: filters.sort ?? AdminSort.TypeDesc,
                }).unwrap();
            } catch (error) {
                setToast({
                    text: "Произошла ошибка при загрузке рекламы",
                    type: HintType.Error,
                });
            }
        };

        fetchData();
    }, [filters.page, filters.sort, getBanners]);

    const handleOpenDeleteModal = (idValue: string) => {
        setBannerToDelete({ id: idValue });
    };

    const handleCloseDeleteModal = () => {
        setBannerToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!bannerToDelete) return;

        try {
            await deleteBanner(bannerToDelete.id).unwrap();
            setToast({
                text: "Реклама была успешно удалена",
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
            field: "description",
            headerName: "Текст рекламы",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 150,
        },
        {
            field: "url",
            headerName: "Ссылка",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 150,
        },
        {
            field: "isActive",
            headerName: "Опубликовано",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 150,
            type: "boolean",
        },
        {
            field: "type",
            headerName: "Формат баннера",
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
                    getAdminBannerMarketingPersonalPageUrl(locale, params.row.id),
                );

                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Показать рекламу"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить рекламу"
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
        if (!bannersData) {
            return <span>Рекламы не было найдено</span>;
        }
        return (
            <DataGrid
                rows={adminBannerMarketingListAdapter(bannersData?.data)}
                columns={columns}
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
                hideFooter
            />
        );
    };

    const totalPages = () => {
        if (!bannersData) return 0;
        return Math.ceil(bannersData.pagination.total / PER_PAGE);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <div className={styles.actionButtons}>
                <ButtonLink
                    type="primary"
                    className={styles.btn}
                    path={getAdminBannerMarketingCreatePageUrl(locale)}
                >
                    Добавить рекламу
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
                isModalOpen={!!bannerToDelete}
                description={`Вы уверены, что хотите удалить рекламу "${bannerToDelete?.id}"? Это действие нельзя отменить.`}
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
