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
    AdminSort, useDeleteAdminCourseMutation,
    useLazyGetAdminCoursesQuery,
} from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./AdminCoursesTable.module.scss";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import { getAdminCourseCreatePageUrl, getAdminCoursePersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { getFullName } from "@/shared/lib/getFullName";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

interface CoursesFilters {
    authorFirstName?: string;
    authorLastName?: string;
    courseName?: string;
    sort?: AdminSort;
}

const courseCustomFields: CustomFilterField<keyof CoursesFilters>[] = [
    {
        key: "authorFirstName",
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
        key: "authorLastName",
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
        key: "courseName",
        label: "Поиск по названию курса",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по названию курса"
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
                    <MenuItem value={AdminSort.FioAuthorAsc}>Имя автора ↑</MenuItem>
                    <MenuItem value={AdminSort.FioAuthorDesc}>Имя автора ↓</MenuItem>
                    <MenuItem value={AdminSort.NameAsc}>Название курса ↑</MenuItem>
                    <MenuItem value={AdminSort.NameDesc}>Название курса ↓</MenuItem>
                    <MenuItem value={AdminSort.IsActiveAsc}>Курс опубликован ↑</MenuItem>
                    <MenuItem value={AdminSort.IsActiveDesc}>Курс опубликован ↓</MenuItem>
                    <MenuItem value={AdminSort.TakeCourseCountAsc}>
                        Кол-во участников начали ↑
                    </MenuItem>
                    <MenuItem value={AdminSort.TakeCourseCountDesc}>
                        Кол-во участников начали ↓
                    </MenuItem>
                    <MenuItem value={AdminSort.CompleteCourseCountAsc}>
                        Кол-во участников закончили ↑
                    </MenuItem>
                    <MenuItem value={AdminSort.CompleteCourseCountDesc}>
                        Кол-во участников закончили ↓
                    </MenuItem>
                    <MenuItem value={AdminSort.ReviewsCountAsc}>Кол-во отзывов ↑</MenuItem>
                    <MenuItem value={AdminSort.ReviewsCountDesc}>Кол-во отзывов ↓</MenuItem>
                    <MenuItem value={AdminSort.AverageRatingAsc}>Рейтинг ↑</MenuItem>
                    <MenuItem value={AdminSort.AverageRatingDesc}>Рейтинг ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

const COURSES_PER_PAGE = 30;

export const AdminCoursesTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [courseToDelete, setCourseToDelete] = useState<
    { id: number; } | null>(null);
    const [filters, setFilters] = useState<Partial<CoursesFilters>>(
        { sort: AdminSort.IdAsc },
    );
    const [getCourses, {
        data: coursesData,
        isLoading,
        isFetching,
    }] = useLazyGetAdminCoursesQuery();
    const [deleteCourse, { isLoading: isDeleting }] = useDeleteAdminCourseMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getCourses({
                    page: currentPage,
                    limit: COURSES_PER_PAGE,
                    sort: filters.sort ?? AdminSort.IdAsc,
                    authorFirstName: filters.authorFirstName,
                    authorLastName: filters.authorLastName,
                    name: filters.courseName,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке курсов",
                    type: HintType.Error,
                });
            }
        };
        fetchData();
    }, [currentPage, filters, getCourses]);

    const handleOpenDeleteModal = (id: number) => {
        setCourseToDelete({ id });
    };

    const handleCloseDeleteModal = () => {
        setCourseToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!courseToDelete) return;

        try {
            await deleteCourse(courseToDelete.id).unwrap();
            setToast({
                text: "Курс был успешно удалён",
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
            field: "author",
            headerName: "Автор",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "name",
            headerName: "Название курса",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "isPublic",
            headerName: "Курс опубликован",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
            type: "boolean",
        },
        {
            field: "totalStart",
            headerName: "Кол-во участников начали",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "totalEnd",
            headerName: "Кол-во участников закончили",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "totalReviews",
            headerName: "Кол-во отзывов",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "averageReviews",
            headerName: "Рейтинг",
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
                    getAdminCoursePersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать курс"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить курс"
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
        if (!coursesData) {
            return <span className={styles.text}>Курсы не были найдены</span>;
        }
        const adaptedData: any[] = coursesData.data.map((course) => {
            const {
                id, author, averageRating, completeCourseCount,
                isActive, reviewsCount, takeCourseCount, name,
            } = course;
            return {
                id,
                author: getFullName(author.firstName, author.lastName),
                name,
                isPublic: isActive,
                totalStart: takeCourseCount,
                totalEnd: completeCourseCount,
                totalReviews: reviewsCount,
                averageReviews: averageRating,
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
        if (!coursesData) return 0;
        return Math.ceil(coursesData.pagination.total / COURSES_PER_PAGE);
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <div className={styles.actionButtons}>
                <ButtonLink
                    type="primary"
                    className={styles.btn}
                    path={getAdminCourseCreatePageUrl(locale)}
                >
                    Добавить курс
                </ButtonLink>
                <AdminFiltersTable
                    filters={filters}
                    onFilterChange={setFilters}
                    onApply={handleApplyFilters}
                    disabled={isLoading}
                    customFields={courseCustomFields}
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
                isModalOpen={!!courseToDelete}
                description={`Вы уверены, что хотите удалить курс "${courseToDelete?.id}"? Это действие нельзя отменить.`}
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
