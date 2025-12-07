import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getAdminSkillCreatePageUrl, getAdminSkillPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { useDeleteSkillMutation, useLazyGetSkillsQuery } from "@/entities/Admin";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./AdminSkillsTable.module.scss";
import { AdminFiltersTable, FilterFields, FilterSortField } from "@/shared/ui/AdminFiltersTable/AdminFiltersTable";

const SKILLS_PER_PAGE = 30;

export const AdminSkillsTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [skillToDelete, setSkillToDelete] = useState<
    { id: number; name: string } | null>(null);
    const [filters, setFilters] = useState<Partial<FilterFields>>({
        sort: FilterSortField.IdAsc,
        id: undefined,
        search: "",
    });
    const [getSkills, {
        data: skillsData,
        isLoading,
    }] = useLazyGetSkillsQuery();
    const [deleteSkill, { isLoading: isDeleting }] = useDeleteSkillMutation();

    useEffect(() => {
        const fetchData = async () => {
            await getSkills({
                page: currentPage,
                limit: SKILLS_PER_PAGE,
                sort: filters.sort,
                id: filters.id,
                name: filters.search,
            }).unwrap().catch(() => {
                setToast({
                    text: "Произошла ошибка при загрузке навыков",
                    type: HintType.Error,
                });
            });
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

    if (isLoading) {
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

    const handleFilterChange = (newFilters: Partial<FilterFields>) => {
        const {
            id, search, sort,
        } = newFilters;
        setFilters({
            id,
            search,
            sort,
        });
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
                    onFilterChange={handleFilterChange}
                    onApply={handleApplyFilters}
                    disabled={isLoading}
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
