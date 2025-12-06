import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { useDeleteFoodMutation, useLazyGetFoodsQuery } from "@/entities/Admin";
import { getAdminFoodVacanciesCreatePageUrl, getAdminFoodVacanciesPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import styles from "./AdminFoodsTable.module.scss";

const FOODS_PER_PAGE = 30;

export const AdminFoodsTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [foodToDelete, setFoodToDelete] = useState<
    { id: number; name: string } | null>(null);
    const [getFoods, {
        data: foodsData,
        isLoading,
    }] = useLazyGetFoodsQuery();
    const [deleteSkill, { isLoading: isDeleting }] = useDeleteFoodMutation();

    useEffect(() => {
        const fetchData = async () => {
            await getFoods({
                page: currentPage,
                limit: FOODS_PER_PAGE,
            }).unwrap()
                .catch(() => {
                    setToast({
                        text: "Произошла ошибка при загрузке питания",
                        type: HintType.Error,
                    });
                });
        };

        fetchData();
    }, [currentPage, getFoods]);

    const handleOpenDeleteModal = (id: number, name: string) => {
        setFoodToDelete({ id, name });
    };

    const handleCloseDeleteModal = () => {
        setFoodToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!foodToDelete) return;

        try {
            await deleteSkill(foodToDelete.id).unwrap();
            setToast({
                text: "Питание было успешно удалено",
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
        { field: "id", headerName: "ID", disableColumnMenu: false },
        {
            field: "name", headerName: "Название", disableColumnMenu: false, width: 240,
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
                <ReactSVG src={getMediaContent(params.row.imagePath) ?? ""} className={styles.foodImg} />
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
                    getAdminFoodVacanciesPersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать питание"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить питание"
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
        if (!foodsData) {
            return <span className={styles.text}>Питание не было найдено</span>;
        }
        return (
            <DataGrid
                rows={foodsData.data ?? []}
                columns={columns}
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
            />
        );
    };

    const totalPages = () => {
        if (!foodsData) return 0;
        return Math.ceil(foodsData.pagination.total / FOODS_PER_PAGE);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <ButtonLink
                type="primary"
                className={styles.btn}
                path={getAdminFoodVacanciesCreatePageUrl(locale)}
            >
                Добавить питание
            </ButtonLink>
            <div className={styles.table}>
                {renderTable()}
            </div>
            <OfferPagination
                currentPage={currentPage}
                totalPages={totalPages()}
                onPageChange={setCurrentPage}
            />
            <ConfirmActionModal
                isModalOpen={!!foodToDelete}
                description={`Вы уверены, что хотите удалить навык "${foodToDelete?.name}"? Это действие нельзя отменить.`}
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
