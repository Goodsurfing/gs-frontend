import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ReactSVG } from "react-svg";
import { Stack } from "@mui/material";
import cn from "classnames";
import { mockedHostData } from "@/entities/Host/model/data/mockedHostData";
import { adminOrganizationsAdapter, AdminOrganizationsFields } from "@/entities/Admin";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import blockIcon from "@/shared/assets/icons/admin/block.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminOrganizationsTable.module.scss";
import { getAdminPersonalOrganizationPageUrl } from "@/shared/config/routes/AppUrls";

const rows: AdminOrganizationsFields[] = adminOrganizationsAdapter([mockedHostData]);

export const AdminOrganizationsTable = () => {
    const [pageSize, setPageSize] = useState(50);
    const navigate = useNavigate();
    const { locale } = useLocale();

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", disableColumnMenu: false },
        {
            field: "name", headerName: "Название", disableColumnMenu: false, width: 240,
        },
        {
            field: "owner",
            headerName: "Владелец",
            sortable: false,
            filterable: true,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "countMembers",
            headerName: "Кол-во участников",
            type: "number",
            sortable: true,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "countVacancies",
            headerName: "Кол-во вакансий",
            type: "number",
            sortable: true,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
        },
        {
            field: "countVolunteers",
            headerName: "Кол-вл гудсёрферов",
            type: "number",
            sortable: true,
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
                    getAdminPersonalOrganizationPageUrl(locale, params.row.id),
                );
                const handleBlock = () => alert(`Заблокировать организацию ${params.row.id}?`);
                const handleDelete = () => alert(`Удалить организацию ${params.row.id}?`);

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Показать организацию"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleBlock}
                            type="button"
                            title="Заблокировать организацию"
                            className={cn(styles.btnIcon, styles.btnBlock)}
                        >
                            <ReactSVG src={blockIcon} />
                        </button>
                        <button
                            onClick={handleDelete}
                            type="button"
                            title="Удалить организацию"
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
