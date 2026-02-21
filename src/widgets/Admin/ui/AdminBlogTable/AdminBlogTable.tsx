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
    AdminSort, useDeleteAdminBlogMutation, useLazyGetAdminBlogListQuery,
} from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./AdminBlogTable.module.scss";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { getAdminBlogPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { getFullName } from "@/shared/lib/getFullName";

interface BlogFilters {
    name?: string;
    firstName?: string;
    lastName?: string;
    sort?: AdminSort;
}

const blogCustomFields: CustomFilterField<keyof BlogFilters>[] = [
    {
        key: "name",
        label: "Поиск по названию статьи",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по названию статьи"
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
                    <MenuItem value={AdminSort.NameAsc}>Название статьи ↑</MenuItem>
                    <MenuItem value={AdminSort.NameDesc}>Название статьи ↓</MenuItem>
                    <MenuItem value={AdminSort.CategoryNameAsc}>Категории ↑</MenuItem>
                    <MenuItem value={AdminSort.CategoryNameDesc}>Категории ↓</MenuItem>
                    <MenuItem value={AdminSort.FioAsc}>ФИО автора ↑</MenuItem>
                    <MenuItem value={AdminSort.FioDesc}>ФИО автора ↓</MenuItem>
                    <MenuItem value={AdminSort.IsActiveAsc}>
                        Опубликовано ↑
                    </MenuItem>
                    <MenuItem value={AdminSort.IsActiveDesc}>
                        Опубликовано ↓
                    </MenuItem>
                    <MenuItem value={AdminSort.ReviewsCountAsc}>Кол-во комментариев ↑</MenuItem>
                    <MenuItem value={AdminSort.ReviewsCountDesc}>Кол-во комментариев ↓</MenuItem>
                    <MenuItem value={AdminSort.CreatedAsc}>Дата ↑</MenuItem>
                    <MenuItem value={AdminSort.CreatedDesc}>Дата ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

const BLOG_PER_PAGE = 30;

export const AdminBlogTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [blogToDelete, setBlogToDelete] = useState<
    { id: string; } | null>(null);
    const [filters, setFilters] = useState<Partial<BlogFilters>>(
        { sort: AdminSort.NameAsc },
    );
    const [getBlog, {
        data: blogData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminBlogListQuery();
    const [deleteBlog, { isLoading: isDeleting }] = useDeleteAdminBlogMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getBlog({
                    page: currentPage,
                    limit: BLOG_PER_PAGE,
                    sort: filters.sort ?? AdminSort.NameAsc,
                    name: filters.name,
                    firstName: filters.firstName,
                    lastName: filters.lastName,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке статей",
                    type: HintType.Error,
                });
            }
        };
        fetchData();
    }, [currentPage, filters, getBlog]);

    const handleOpenDeleteModal = (id: string) => {
        setBlogToDelete({ id });
    };

    const handleCloseDeleteModal = () => {
        setBlogToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!blogToDelete) return;

        try {
            await deleteBlog(Number(blogToDelete.id)).unwrap();
            setToast({
                text: "Статья была успешна удалена",
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
            headerName: "Опубликована",
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
                    getAdminBlogPersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать статью"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить статью"
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
        if (!blogData) {
            return <span className={styles.text}>Статьи не были найдены</span>;
        }
        const adaptedData: any[] = blogData.data.map((blog) => {
            const {
                id, name, categoryName,
                created, isActive, reviewCount,
                author,
            } = blog;
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
        if (!blogData) return 0;
        return Math.ceil(blogData.pagination.total / BLOG_PER_PAGE);
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
                    customFields={blogCustomFields}
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
                isModalOpen={!!blogToDelete}
                description={`Вы уверены, что хотите удалить статью "${blogToDelete?.id}"? Это действие нельзя отменить.`}
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
