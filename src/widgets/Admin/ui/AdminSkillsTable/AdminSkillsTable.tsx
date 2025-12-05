import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminSkillsTable.module.scss";
import { getAdminSkillCreatePageUrl, getAdminSkillPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { useDeleteSkillMutation, useLazyGetSkillsQuery } from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getMediaContent } from "@/shared/lib/getMediaContent";

const SKILLS_PER_PAGE = 30;

export const AdminSkillsTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [skillToDelete, setSkillToDelete] = useState<
    { id: number; name: string } | null>(null);
    const [getSkills, {
        data: skillsData,
        isLoading,
    }] = useLazyGetSkillsQuery();
    const [deleteSkill, { isLoading: isDeleting }] = useDeleteSkillMutation();

    useEffect(() => {
        const fetchData = async () => {
            await getSkills({
                page: currentPage,
                limit: SKILLS_PER_PAGE,
            }).unwrap();
        };

        fetchData();
    }, [currentPage, getSkills]);

    const handleOpenDeleteModal = (id: number, name: string) => {
        setSkillToDelete({ id, name });
    };

    const handleCloseDeleteModal = () => {
        setSkillToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!skillToDelete) return;

        try {
            await deleteSkill(skillToDelete.id).unwrap();
            setToast({
                text: "Навык был успешно удален",
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
                <ReactSVG src={getMediaContent(params.row.imagePath) ?? ""} className={styles.skillImg} />
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
                    getAdminSkillPersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать навык"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить наывк"
                            className={cn(styles.btnIcon, styles.btnDelete)}
                        >
                            <ReactSVG src={deleteIcon} />
                        </button>
                    </Stack>
                );
            },
        },
    ];

    if (!skillsData || isLoading) {
        return (
            <MiniLoader />
        );
    }

    const totalPages = Math.ceil(skillsData.pagination.total / SKILLS_PER_PAGE);

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <ButtonLink type="primary" className={styles.btn} path={getAdminSkillCreatePageUrl(locale)}>Добавить навык</ButtonLink>
            <div className={styles.table}>
                <DataGrid
                    rows={skillsData.data ?? []}
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
                isModalOpen={!!skillToDelete}
                description={`Вы уверены, что хотите удалить навык "${skillToDelete?.name}"? Это действие нельзя отменить.`}
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
