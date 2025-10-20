import { Profile } from "@/entities/Profile";
import { Button, Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const rows: Profile[] = [

];

export const AdminUsersTable = () => {
    const [pageSize, setPageSize] = useState(50);
    const navigate = useNavigate();

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "firstName", headerName: "First name", width: 130 },
        { field: "lastName", headerName: "Last name", width: 130 },
        {
            field: "age", headerName: "Age", type: "number", width: 90,
        },
        {
            field: "actions",
            headerName: "Действия",
            width: 320,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const handleView = () => navigate(`/admin/users/${params.row.id}`);
                const handleEdit = () => navigate(`/admin/users/${params.row.id}/edit`);
                const handleDelete = () => alert(`Удалить пользователя ${params.row.id}?`);

                return (
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" size="small" onClick={handleView}>
                            Редакт.
                        </Button>
                        <Button variant="contained" size="small" color="primary" onClick={handleEdit}>
                            Блокировать
                        </Button>
                        <Button variant="contained" size="small" color="error" onClick={handleDelete}>
                            Удалить
                        </Button>
                    </Stack>
                );
            },
        },
    ];
    return (
        <div style={{ height: "80vh" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                pagination
                sx={{ border: 0 }}
            />
        </div>
    );
};
