import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import { OfferPagination } from "@/widgets/OffersMap";
import { getAdminCategoriesVacanciesCreatePageUrl, getAdminCategoriesVacanciesPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useDeleteCategoryVacancyMutation, useLazyGetCategoriesVacancyQuery } from "@/entities/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./AdminCategoriesTable.module.scss";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";

const CATEGORIES_PER_PAGE = 30;

export const AdminCategoriesTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [categoryToDelete, setCategoryToDelete] = useState<
    { id: number; name: string } | null>(null);
    const [getCategories, {
        data: categoriesData,
        isLoading,
    }] = useLazyGetCategoriesVacancyQuery();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryVacancyMutation();

    useEffect(() => {
        const fetchData = async () => {
            await getCategories({
                page: currentPage,
                limit: CATEGORIES_PER_PAGE,
            }).unwrap()
                .catch(() => {
                    setToast({
                        text: "Произошла ошибка при загрузке категорий",
                        type: HintType.Error,
                    });
                });
        };

        fetchData();
    }, [currentPage, getCategories]);

    const handleOpenDeleteModal = (id: number, name: string) => {
        setCategoryToDelete({ id, name });
    };

    const handleCloseDeleteModal = () => {
        setCategoryToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!categoryToDelete) return;

        try {
            await deleteCategory(categoryToDelete.id).unwrap();
            setToast({
                text: "Категория была успешно удалена",
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
            width: 240,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
        {
            field: "color",
            headerName: "Цвет",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
            renderCell: (params) => (
                <div className={cn(styles.color)}>
                    <span>{params.row.color}</span>
                    <div
                        className={styles.colorItem}
                        style={{ backgroundColor: params.row.color }}
                    />
                </div>
            ),
        },
        {
            field: "imagePath",
            headerName: "Картинка",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
            renderCell: (params) => (
                <img
                    className={styles.categoryImg}
                    src={getMediaContent(params.row.imagePath)}
                    alt={params.row.imagePath}
                />
            ),
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
                    getAdminCategoriesVacanciesPersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать категорию"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить категорию"
                            className={cn(styles.btnIcon, styles.btnDelete)}
                        >
                            <ReactSVG src={deleteIcon} />
                        </button>
                    </Stack>
                );
            },
        },
    ];

    if (isLoading) {
        return (
            <MiniLoader />
        );
    }

    const renderTable = () => {
        if (!categoriesData) {
            return <span className={styles.text}>Категорий не было найдено</span>;
        }
        return (
            <DataGrid
                rows={categoriesData.data ?? []}
                columns={columns}
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
            />
        );
    };

    const totalPages = () => {
        if (!categoriesData) return 0;
        return Math.ceil(categoriesData.pagination.total / CATEGORIES_PER_PAGE);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <ButtonLink
                type="primary"
                className={styles.btn}
                path={getAdminCategoriesVacanciesCreatePageUrl(locale)}
            >
                Добавить категорию
            </ButtonLink>
            {renderTable()}
            <OfferPagination
                currentPage={currentPage}
                totalPages={totalPages()}
                onPageChange={setCurrentPage}
            />
            <ConfirmActionModal
                isModalOpen={!!categoryToDelete}
                description={`Вы уверены, что хотите удалить категорию "${categoryToDelete?.name}"? Это действие нельзя отменить.`}
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
