import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import cookingIcon from "@/shared/assets/icons/skills/cooking.svg";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminSkillsTable.module.scss";
import { getAdminSkillPersonalPageUrl } from "@/shared/config/routes/AppUrls";

interface SkillType {
    id: number;
    name: string;
    img: string;
}

const rows: SkillType[] = [
    {
        id: 1,
        name: "Навык 1",
        img: cookingIcon,
    },
    {
        id: 2,
        name: "Навык 2",
        img: cookingIcon,
    },
    {
        id: 3,
        name: "Навык 3",
        img: cookingIcon,
    },
];

export const AdminSkillsTable = () => {
    const [pageSize, setPageSize] = useState(50);
    const navigate = useNavigate();
    const { locale } = useLocale();

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
                <ReactSVG className={styles.skillImg} src={params.row.img} />
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
                const handleDelete = () => alert(`Удалить навык ${params.row.id}?`);

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
                            onClick={handleDelete}
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

    return (
        <div className={styles.wrapper}>
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
