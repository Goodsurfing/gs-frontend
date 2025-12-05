import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import styles from "./AdminAchievementsTable.module.scss";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getAdminAchievementCreatePageUrl, getAdminAchievementPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { useDeleteAchievementMutation, useLazyGetAchievementsQuery } from "@/entities/Admin";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

const ACHIEVEMENTS_PER_PAGE = 30;

export const AdminAchievementsTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [achievementToDelete, setAchievementToDelete] = useState<
    { id: number; name: string } | null>(null);
    const [getAchievements, {
        data: achievemnetsData,
        isLoading,
    }] = useLazyGetAchievementsQuery();
    const [deleteAchievement, { isLoading: isDeleting }] = useDeleteAchievementMutation();

    useEffect(() => {
        const fetchData = async () => {
            await getAchievements({
                page: currentPage,
                limit: ACHIEVEMENTS_PER_PAGE,
            }).unwrap();
        };

        fetchData();
    }, [currentPage, getAchievements]);

    const handleOpenDeleteModal = (id: number, name: string) => {
        setAchievementToDelete({ id, name });
    };

    const handleCloseDeleteModal = () => {
        setAchievementToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!achievementToDelete) return;

        try {
            await deleteAchievement(achievementToDelete.id).unwrap();
            setToast({
                text: "Достижение было успешно удалено",
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
            sortable: true,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
            renderCell: (params) => (
                <ReactSVG className={styles.achivImg} src={params.row.imagePath} />
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
                    getAdminAchievementPersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать достижение"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить достижение"
                            className={cn(styles.btnIcon, styles.btnDelete)}
                        >
                            <ReactSVG src={deleteIcon} />
                        </button>
                    </Stack>
                );
            },
        },
    ];

    if (!achievemnetsData || isLoading) {
        return (
            <MiniLoader />
        );
    }

    const totalPages = Math.ceil(achievemnetsData.pagination.total / ACHIEVEMENTS_PER_PAGE);

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <ButtonLink type="primary" className={styles.btn} path={getAdminAchievementCreatePageUrl(locale)}>Добавить достижение</ButtonLink>
            <div className={styles.table}>
                <DataGrid
                    rows={achievemnetsData.data ?? []}
                    columns={columns}
                    sx={{ border: 0 }}
                    rowsPerPageOptions={[]}
                    disableSelectionOnClick
                />
            </div>
            <OfferPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            <ConfirmActionModal
                isModalOpen={!!achievementToDelete}
                description={`Вы уверены, что хотите удалить достижение "${achievementToDelete?.name}"? Это действие нельзя отменить.`}
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
