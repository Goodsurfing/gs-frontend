import React, { useState } from "react";
import {
    FormControl, InputLabel, MenuItem, Select, Stack,
} from "@mui/material";
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
import {
    AdminFiltersTable, CustomFilterField, FilterFields, FilterSortField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";

const rows: AdminUsersFields[] = adminUsersAdapter(mockedProfileData);

const USERS_PER_PAGE = 30;

export const AdminUsersTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [toast, setToast] = useState<ToastAlert>();
    const [filters, setFilters] = useState<FilterFields<{ status?: string }>>({
        sort: FilterSortField.IdAsc,
        search: "",
        status: undefined,
    });
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [getSkills, {
        data: skillsData,
        isLoading,
    }] = useLazyGetSkillsQuery();
    const [deleteSkill, { isLoading: isDeleting }] = useDeleteSkillMutation();

    const customFields: CustomFilterField<"status">[] = [
        {
            key: "status",
            label: "Статус",
            render: ({ value, onChange, disabled }) => (
                <FormControl fullWidth size="small">
                    <InputLabel>Статус</InputLabel>
                    <Select
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value || undefined)}
                        label="Статус"
                        disabled={disabled}
                    >
                        <MenuItem value="">Все</MenuItem>
                        <MenuItem value="active">Активен</MenuItem>
                        <MenuItem value="inactive">Неактивен</MenuItem>
                    </Select>
                </FormControl>
            ),
        },
    ];

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
            {/* <AdminFiltersTable
                filters={filters}
                onFilterChange={setFilters}
                onApply={handleApplyFilters}
                customFields={customFields}
            /> */}
            <DataGrid
                rows={rows}
                columns={columns}
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
            />
        </div>
    );
};
