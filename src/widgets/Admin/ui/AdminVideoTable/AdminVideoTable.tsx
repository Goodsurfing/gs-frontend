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
    AdminSort, useDeleteAdminVideoMutation,
    useLazyGetAdminVideoListQuery,
} from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { getFullName } from "@/shared/lib/getFullName";
import { getAdminVideoCreatePageUrl, getAdminVideoPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import styles from "./AdminVideoTable.module.scss";

interface VideoFilters {
    name?: string;
    firstName?: string;
    lastName?: string;
    sort?: AdminSort;
}

const videoCustomFields: CustomFilterField<keyof VideoFilters>[] = [
    {
        key: "name",
        label: "Поиск по названию видео",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по названию видео"
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
        key: "sort",
        label: "Сортировка",
        render: ({ value, onChange, disabled }) => (
            <FormControl fullWidth size="small" disabled={disabled}>
                <InputLabel id="video-sort-label" sx={{ background: "background.paper", px: 0.5 }}>
                    Сортировка
                </InputLabel>
                <Select
                    labelId="video-sort-label"
                    value={value || AdminSort.IdAsc}
                    label="Сортировка"
                    onChange={(e) => onChange(e.target.value as AdminSort)}
                    MenuProps={{
                        PaperProps: {
                            style: { maxHeight: 200 },
                        },
                    }}
                >
                    <MenuItem value={AdminSort.NameAsc}>Название ↑</MenuItem>
                    <MenuItem value={AdminSort.NameDesc}>Название ↓</MenuItem>
                    <MenuItem value={AdminSort.CategoryNameAsc}>Категория ↑</MenuItem>
                    <MenuItem value={AdminSort.CategoryNameDesc}>Категория ↓</MenuItem>
                    <MenuItem value={AdminSort.FioAsc}>ФИО пользователя ↑</MenuItem>
                    <MenuItem value={AdminSort.FioDesc}>ФИО пользователя ↓</MenuItem>
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

const VIDEOS_PER_PAGE = 30;

export const AdminVideoTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [videoToDelete, setVideoToDelete] = useState<
    { id: string } | null>(null);
    const [filters, setFilters] = useState<Partial<VideoFilters>>(
        { sort: AdminSort.NameAsc },
    );

    const [getVideos, {
        data: videosData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminVideoListQuery();

    const [deleteVideo, { isLoading: isDeleting }] = useDeleteAdminVideoMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getVideos({
                    page: currentPage,
                    limit: VIDEOS_PER_PAGE,
                    sort: filters.sort,
                    name: filters.name,
                    firstName: filters.firstName,
                    lastName: filters.lastName,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке видео",
                    type: HintType.Error,
                });
            }
        };
        fetchData();
    }, [currentPage, filters, getVideos]);

    const handleOpenDeleteModal = (id: string) => {
        setVideoToDelete({ id });
    };

    const handleCloseDeleteModal = () => {
        setVideoToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!videoToDelete) return;

        try {
            await deleteVideo(videoToDelete.id).unwrap();
            setToast({
                text: "Видео было успешно удалено",
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
            field: "created",
            headerName: "Дата",
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
            field: "actions",
            headerName: "Действия",
            width: 160,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            renderCell: (params) => {
                const handleView = async () => {
                    navigate(getAdminVideoPersonalPageUrl(locale, params.row.id));
                };
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id);
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
        if (!videosData) {
            return <span className={styles.text}>Видео не были найдены</span>;
        }
        const adaptedData: any[] = videosData.data.map((video) => {
            const {
                id, name, categoryName,
                author, created, isActive, reviewCount,
            } = video;
            return {
                id,
                name,
                categoryName,
                created,
                authorName: getFullName(author.firstName, author.lastName),
                isActive,
                reviewCount,
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
        if (!videosData) return 0;
        return Math.ceil(videosData.pagination.total / VIDEOS_PER_PAGE);
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
                    customFields={videoCustomFields}
                />
                <ButtonLink
                    path={getAdminVideoCreatePageUrl(locale)}
                    type="primary"
                    className={styles.btn}
                >
                    Добавить видео
                </ButtonLink>
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
                isModalOpen={!!videoToDelete}
                description={`Вы уверены, что хотите удалить видео "${videoToDelete?.id}"? Это действие нельзя отменить.`}
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
