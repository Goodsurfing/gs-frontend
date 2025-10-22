import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { adminUsersAdapter } from "../../lib/adminAdapters";
import { mockedProfileData } from "@/entities/Profile/model/data/mockedProfileData";
import styles from "./UserInfoTable.module.scss";

const user = adminUsersAdapter(mockedProfileData)[0];

const rows = Object.entries(user).map(([key, value], index) => ({
    id: index,
    field: key,
    value: String(value),
}));

export const UserInfoTable = () => {
    const columns: GridColDef[] = [
        { field: "field", headerName: "Поле", flex: 1 },
        { field: "value", headerName: "Значение", flex: 2 },
    ];

    return (
        <div className={styles.wrapper}>
            <DataGrid
                rows={rows}
                columns={columns}
                sx={{ border: 0 }}
                disableSelectionOnClick
                hideFooter
                disableColumnMenu
            />
        </div>
    );
};
