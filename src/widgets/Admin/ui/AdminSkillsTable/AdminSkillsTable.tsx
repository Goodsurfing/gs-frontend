import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    FormControl, InputLabel, MenuItem, Select, Stack, TextField,
} from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getAdminSkillCreatePageUrl, getAdminSkillPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { AdminSort, useDeleteSkillMutation, useLazyGetSkillsQuery } from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./AdminSkillsTable.module.scss";
import {
    AdminFiltersTable, CustomFilterField,
} from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";

interface SkillFilters {
    id?: number;
    name?: string;
    sort?: AdminSort;
}

const skillCustomFields: CustomFilterField<keyof SkillFilters>[] = [
    {
        key: "id",
        label: "ID",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="ID"
                type="number"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                fullWidth
                size="small"
                inputProps={{ min: 1, step: 1 }}
                disabled={disabled}
            />
        ),
    },
    {
        key: "name",
        label: "Название навыка",
        render: ({ value, onChange, disabled }) => (
            <TextField
                label="Название"
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
                <InputLabel id="skill-sort-label" sx={{ background: "background.paper", px: 0.5 }}>
                    Сортировка
                </InputLabel>
                <Select
                    labelId="skill-sort-label"
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
                    <MenuItem value={AdminSort.NameAsc}>Название ↑</MenuItem>
                    <MenuItem value={AdminSort.NameDesc}>Название ↓</MenuItem>
                </Select>
            </FormControl>
        ),
    },
];

const SKILLS_PER_PAGE = 30;

export const AdminSkillsTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [skillToDelete, setSkillToDelete] = useState<
    { id: number; name: string } | null>(null);
    const [filters, setFilters] = useState<Partial<SkillFilters>>({
        sort: AdminSort.IdAsc,
    });
    const [getSkills, {
        data: skillsData,
        isLoading,
        isFetching,
    }] = useLazyGetSkillsQuery();
    const [deleteSkill, { isLoading: isDeleting }] = useDeleteSkillMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getSkills({
                    page: currentPage,
                    limit: SKILLS_PER_PAGE,
                    sort: filters.sort ?? AdminSort.IdAsc,
                    id: filters.id,
                    name: filters.name,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке навыков",
                    type: HintType.Error,
                });
            }
        };
        fetchData();
    }, [currentPage, filters, getSkills]);

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

    if (isLoading || isFetching) {
        return (
            <MiniLoader />
        );
    }

    const renderTable = () => {
        if (!skillsData) {
            return <span className={styles.text}>Навыков не было найдено</span>;
        }
        return (
            <DataGrid
                rows={skillsData.data ?? []}
                columns={columns}
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
            />
        );
    };

    const totalPages = () => {
        if (!skillsData) return 0;
        return Math.ceil(skillsData.pagination.total / SKILLS_PER_PAGE);
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h2>Таблица навыков</h2>
            <div className={styles.actionButtons}>
                <ButtonLink
                    type="primary"
                    className={styles.btn}
                    path={getAdminSkillCreatePageUrl(locale)}
                >
                    Добавить навык
                </ButtonLink>
                <AdminFiltersTable
                    filters={filters}
                    onFilterChange={setFilters}
                    onApply={handleApplyFilters}
                    disabled={isLoading}
                    customFields={skillCustomFields}
                />
            </div>
            <div className={styles.table}>
                {renderTable()}
            </div>
            <OfferPagination
                currentPage={currentPage}
                totalPages={totalPages()}
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
