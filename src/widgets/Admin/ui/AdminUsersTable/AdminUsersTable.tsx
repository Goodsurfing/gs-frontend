import React, { useState } from "react";
import { Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import { mockedProfileData } from "@/entities/Profile/model/data/mockedProfileData";
import { getAdminPersonalUserPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { adminUsersAdapter, AdminUsersFields } from "@/entities/Admin";

import showIcon from "@/shared/assets/icons/admin/show.svg";
import blockIcon from "@/shared/assets/icons/admin/block.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import styles from "./AdminUsersTable.module.scss";

const rows: AdminUsersFields[] = adminUsersAdapter(mockedProfileData);

export const AdminUsersTable = () => {
    const [pageSize, setPageSize] = useState(50);
    const navigate = useNavigate();
    const { locale } = useLocale();

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", disableColumnMenu: false },
        { field: "email", headerName: "E-mail", disableColumnMenu: false },
        {
            field: "name", headerName: "Имя", disableColumnMenu: false, width: 150,
        },
        {
            field: "dateRegistration",
            headerName: "Дата регистрации",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 140,
        },
        {
            field: "dateLogin",
            headerName: "Дата последнего входа",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 140,
        },
        {
            field: "isConfirmed",
            headerName: "Пользователь подтвержден",
            type: "boolean",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
        {
            field: "isVolunteer",
            headerName: "Роль \"Гудсёрфер\"",
            type: "boolean",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
        {
            field: "isHost",
            headerName: "Роль \"Хост\"",
            type: "boolean",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
        {
            field: "isBlock",
            headerName: "Пользователь заблокирован",
            type: "boolean",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
        {
            field: "isMembership",
            headerName: "Членство",
            type: "boolean",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
        {
            field: "dataEndMembership",
            headerName: "Окончание членства",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
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
                    getAdminPersonalUserPageUrl(locale, params.row.id),
                );
                const handleBlock = () => alert(`Заблокировать пользователя ${params.row.id}?`);
                const handleDelete = () => alert(`Удалить пользователя ${params.row.id}?`);

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Показать пользователя"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleBlock}
                            type="button"
                            title="Заблокировать пользователя"
                            className={cn(styles.btnIcon, styles.btnBlock)}
                        >
                            <ReactSVG src={blockIcon} />
                        </button>
                        <button
                            onClick={handleDelete}
                            type="button"
                            title="Удалить пользователя"
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
