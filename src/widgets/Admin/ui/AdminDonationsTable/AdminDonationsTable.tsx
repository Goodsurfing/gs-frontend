import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    adminDonationsAdapter,
    AdminSort,
    useDeleteAdminDonationMutation,
    useLazyGetAdminDonationsQuery,
} from "@/entities/Admin";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getDonationPersonalPage } from "@/shared/config/routes/AppUrls";
import { useQueryFilters } from "@/shared/hooks/usePaginationParams";
import { AdminFiltersTable, CustomFilterField } from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";
import styles from "./AdminDonationsTable.module.scss";

interface DonationFilters {
    name?: string;
    firstName?: string;
    lastName?: string;
    sort?: AdminSort;
}

const donationCustomFields: CustomFilterField<keyof DonationFilters>[] = [
    {
        key: "name",
        label: "Поиск по названию сбора",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по названию сбора"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "firstName",
        label: "Поиск по имени автора",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по имени автора"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "lastName",
        label: "Поиск по фамилии автора",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Поиск по фамилии автора"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || undefined)}
                fullWidth
                size="small"
                disabled={disabled}
            />
        ),
    },
    {
        key: "sort",
        label: "Сортировка",
        render: ({ value, onChange, disabled }) => (
            <FormControl fullWidth size="small" disabled={disabled}>
                <InputLabel id="donation-sort-label" sx={{ background: "background.paper", px: 0.5 }}>
                    Сортировка
                </InputLabel>
                <Select
                    labelId="donation-sort-label"
                    value={value || AdminSort.IdAsc}
                    label="Сортировка"
                    onChange={(e) => onChange(e.target.value as AdminSort)}
                    MenuProps={{
                        PaperProps: {
                            style: { maxHeight: 200 },
                        },
                    }}
                >
                    <MenuItem value={AdminSort.IdAsc}>ID ↑</MenuItem>
                    <MenuItem value={AdminSort.IdDesc}>ID ↓</MenuItem>
                    <MenuItem value={AdminSort.CategoryNameAsc}>Категория ↑</MenuItem>
                    <MenuItem value={AdminSort.CategoryNameDesc}>Категория ↓</MenuItem>
                    <MenuItem value={AdminSort.NameAsc}>Название сбора ↑</MenuItem>
                    <MenuItem value={AdminSort.NameDesc}>Название сбора ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

const PER_PAGE = 30;

export const AdminDonationsTable = () => {
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [donationToDelete, setDonationToDelete] = useState<
    { id: string; name: string } | null>(null);
    const [getDonations, {
        data: donationsData,
        isLoading,
        isFetching,
        isError,
    }] = useLazyGetAdminDonationsQuery();
    const [deleteDonations, { isLoading: isDeleting }] = useDeleteAdminDonationMutation();
    const {
        filters, setFilters,
    } = useQueryFilters({
        page: 1,
        sort: AdminSort.IdDesc,
        name: undefined,
        firstName: undefined,
        lastName: undefined,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getDonations({
                    page: filters.page,
                    limit: PER_PAGE,
                    sort: filters.sort ?? AdminSort.IdDesc,
                    name: filters.name,
                    firstName: filters.firstName,
                    lastName: filters.lastName,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке вакансий",
                    type: HintType.Error,
                });
            }
        };
        fetchData();
    }, [filters.firstName, filters.lastName,
        filters.name, filters.page, filters.sort, getDonations]);

    useEffect(() => {
        if (isError) {
            setToast({
                text: "Произошла ошибка при загрузке сборов",
                type: HintType.Error,
            });
        }
    }, [isError]);

    const handleOpenDeleteModal = (id: string, name: string) => {
        setDonationToDelete({ id, name });
    };

    const handleCloseDeleteModal = () => {
        setDonationToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!donationToDelete) return;

        try {
            await deleteDonations(donationToDelete.id).unwrap();
            setToast({
                text: "Сбор был успешно удален",
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
        {
            field: "id",
            headerName: "ID",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
        {
            field: "name",
            headerName: "Название",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "category",
            headerName: "Категория",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "author",
            headerName: "Автор",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "isActive",
            headerName: "Опубликовано",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
            type: "boolean",
        },
        {
            field: "amout",
            headerName: "Размер сбора",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "minAmount",
            headerName: "Мин. размер сбора",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "peopleSupportCount",
            headerName: "Участников всего",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "percentAmountCollect",
            headerName: "Собрано %",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "moneyRaised",
            headerName: "Собрано рублей",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
        },
        {
            field: "endDate",
            headerName: "Дата окончания сбора",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 240,
            renderCell: (params) => {
                const ts = params.value;
                if (!ts) return "—";
                return new Date(ts * 1000).toLocaleDateString("ru-RU");
            },
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
                    getDonationPersonalPage(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать сбор"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить сбор"
                            className={cn(styles.btnIcon, styles.btnDelete)}
                        >
                            <ReactSVG src={deleteIcon} />
                        </button>
                    </Stack>
                );
            },
        },
    ];

    if (isLoading || isFetching) {
        return (
            <MiniLoader />
        );
    }

    const renderTable = () => {
        if (!donationsData) {
            return <span className={styles.text}>Сборы не были найдены</span>;
        }
        const adaptedData: any[] = adminDonationsAdapter(donationsData);
        return (
            <DataGrid
                rows={adaptedData ?? []}
                columns={columns}
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
            />
        );
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <div className={styles.actionButtons}>
                <AdminFiltersTable
                    filters={filters}
                    onFilterChange={setFilters}
                    disabled={isLoading}
                    customFields={donationCustomFields}
                />
            </div>
            <div className={styles.table}>
                {renderTable()}
            </div>
            <ConfirmActionModal
                isModalOpen={!!donationToDelete}
                description={`Вы уверены, что хотите удалить сбор "${donationToDelete?.name}"? Это действие нельзя отменить.`}
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
