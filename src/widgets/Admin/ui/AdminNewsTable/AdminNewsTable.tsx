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
    AdminSort, useDeleteAdminNewsMutation,
    useLazyGetAdminNewsListQuery,
} from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { getAdminNewsPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import styles from "./AdminNewsTable.module.scss";
import { getFullName } from "@/shared/lib/getFullName";

interface NewsFilters {
    name?: string;
    firstName?: string;
    lastName?: string;
    sort?: AdminSort;
}

const newsCustomFields: CustomFilterField<keyof NewsFilters>[] = [
    {
        key: "name",
        label: "Поиск по названию новости",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по названию новости"
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
        label: "Поиск по имени автора",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по имени автора"
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
        label: "Поиск по фамилии автора",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по фамилии автора"
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
                <InputLabel id="news-sort-label" sx={{ background: "background.paper", px: 0.5 }}>
                    Сортировка
                </InputLabel>
                <Select
                    labelId="news-sort-label"
                    value={value || AdminSort.IdAsc}
                    label="Сортировка"
                    onChange={(e) => onChange(e.target.value as AdminSort)}
                    MenuProps={{
                        PaperProps: {
                            style: { maxHeight: 200 },
                        },
                    }}
                >
                    <MenuItem value={AdminSort.NameAsc}>Название новости ↑</MenuItem>
                    <MenuItem value={AdminSort.NameDesc}>Название новости ↓</MenuItem>
                    <MenuItem value={AdminSort.CategoryNameAsc}>Категория ↑</MenuItem>
                    <MenuItem value={AdminSort.CategoryNameDesc}>Категория ↓</MenuItem>
                    <MenuItem value={AdminSort.FioAsc}>ФИО ↑</MenuItem>
                    <MenuItem value={AdminSort.FioDesc}>ФИО ↓</MenuItem>
                    <MenuItem value={AdminSort.IsActiveAsc}>
                        Опубликовано ↑
                    </MenuItem>
                    <MenuItem value={AdminSort.IsActiveDesc}>
                        Опубликовано ↓
                    </MenuItem>
                    <MenuItem value={AdminSort.ReviewsCountAsc}>Рейтинг ↑</MenuItem>
                    <MenuItem value={AdminSort.ReviewsCountDesc}>Рейтинг ↓</MenuItem>
                    <MenuItem value={AdminSort.CreatedAsc}>Дата ↑</MenuItem>
                    <MenuItem value={AdminSort.CreatedDesc}>Дата ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

const NEWS_PER_PAGE = 30;

export const AdminNewsTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [newsToDelete, setNewsToDelete] = useState<
    { id: string; name: string } | null>(null);
    const [filters, setFilters] = useState<Partial<NewsFilters>>(
        { sort: AdminSort.NameAsc },
    );
    const [getNews, {
        data: newsData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminNewsListQuery();
    const [deleteNews, { isLoading: isDeleting }] = useDeleteAdminNewsMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getNews({
                    page: currentPage,
                    limit: NEWS_PER_PAGE,
                    sort: filters.sort ?? AdminSort.NameAsc,
                    firstName: filters.firstName,
                    lastName: filters.lastName,
                    name: filters.name,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке новостей",
                    type: HintType.Error,
                });
            }
        };
        fetchData();
    }, [currentPage, filters, getNews]);

    const handleOpenDeleteModal = (id: string, name: string) => {
        setNewsToDelete({ id, name });
    };

    const handleCloseDeleteModal = () => {
        setNewsToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!newsToDelete) return;

        try {
            await deleteNews(newsToDelete.id).unwrap();
            setToast({
                text: "Новость была успешна удалена",
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
            field: "isActive",
            headerName: "Опубликовано",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
            type: "boolean",
        },
        {
            field: "reviewCount",
            headerName: "Рейтинг",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "authorName",
            headerName: "Автор",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "created",
            headerName: "Дата",
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
                    getAdminNewsPersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать новость"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить новость"
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
        if (!newsData) {
            return <span className={styles.text}>Новостей не было найдено</span>;
        }
        const adaptedData: any[] = newsData.data.map((offer) => {
            const {
                id, name, categoryName,
                author, created, isActive, reviewCount,
            } = offer;
            return {
                id,
                name,
                categoryName,
                isActive,
                reviewCount,
                authorName: getFullName(author.firstName, author.lastName),
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
        if (!newsData) return 0;
        return Math.ceil(newsData.pagination.total / NEWS_PER_PAGE);
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
                    customFields={newsCustomFields}
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
                isModalOpen={!!newsToDelete}
                description={`Вы уверены, что хотите удалить новость "${newsToDelete?.name}"? Это действие нельзя отменить.`}
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
