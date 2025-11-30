import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import styles from "./AdminAchievementsTable.module.scss";
import medalIcon from "@/shared/assets/icons/medals/ambassador.svg";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getAdminAchievementCreatePageUrl, getAdminAchievementPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";

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
    }] = useLazyGetAchive();
    const [deleteSkill, { isLoading: isDeleting }] = useDeleteSkillMutation();

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", disableColumnMenu: false },
        {
            field: "name", headerName: "Название", disableColumnMenu: false, width: 240,
        },
        {
            field: "img",
            headerName: "Картинка",
            sortable: true,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
            renderCell: (params) => (
                <ReactSVG className={styles.achivImg} src={params.row.img} />
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
                const handleDelete = () => alert(`Удалить достижение ${params.row.id}?`);

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
                            onClick={handleDelete}
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

    return (
        <div className={styles.wrapper}>
            <ButtonLink type="primary" className={styles.btn} path={getAdminAchievementCreatePageUrl(locale)}>Добавить достижение</ButtonLink>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                pagination
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
            />
        </div>
    );
};
