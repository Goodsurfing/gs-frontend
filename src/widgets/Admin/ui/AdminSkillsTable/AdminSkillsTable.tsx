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
import { useQueryFilters } from "@/shared/hooks/usePaginationParams";

interface SkillFilters {
    idSkill?: number;
    nameSkill?: string;
    sortSkill?: AdminSort;
}

const skillCustomFields: CustomFilterField<keyof SkillFilters>[] = [
    {
        key: "idSkill",
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
        key: "nameSkill",
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
        key: "sortSkill",
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
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [skillToDelete, setSkillToDelete] = useState<
    { id: number; name: string } | null>(null);
    const {
        filters, setFilters,
    } = useQueryFilters({
        pageSkill: 1,
        sortSkill: AdminSort.IdAsc,
        idSkill: undefined,
        nameSkill: undefined,
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
                    page: filters.pageSkill,
                    limit: SKILLS_PER_PAGE,
                    sort: filters.sortSkill ?? AdminSort.IdAsc,
                    id: filters.idSkill,
                    name: filters.nameSkill,
                }).unwrap();
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке навыков",
                    type: HintType.Error,
                });
            }
        };
        fetchData();
    }, [filters.idSkill, filters.nameSkill, filters.pageSkill, filters.sortSkill, getSkills]);

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
            return <span>Навыков не было найдено</span>;
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
                    disabled={isLoading}
                    customFields={skillCustomFields}
                />
            </div>
            <div className={styles.table}>
                {renderTable()}
            </div>
            <OfferPagination
                currentPage={filters.pageSkill}
                totalPages={totalPages()}
                onPageChange={(newPage) => setFilters({ pageSkill: newPage })}
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
