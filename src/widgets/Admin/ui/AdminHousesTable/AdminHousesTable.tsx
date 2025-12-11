import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { OfferPagination } from "@/widgets/OffersMap";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { useDeleteHouseMutation, useLazyGetHousesQuery } from "@/entities/Admin";
import { getAdminHouseVacanciesCreatePageUrl, getAdminHouseVacanciesPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import styles from "./AdminHousesTable.module.scss";

const HOUSES_PER_PAGE = 30;

export const AdminHousesTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [houseToDelete, setHouseToDelete] = useState<
    { id: number; name: string } | null>(null);
    const [getHouses, {
        data: housesData,
        isLoading,
    }] = useLazyGetHousesQuery();
    const [deleteSkill, { isLoading: isDeleting }] = useDeleteHouseMutation();

    useEffect(() => {
        const fetchData = async () => {
            await getHouses({
                page: currentPage,
                limit: HOUSES_PER_PAGE,
            }).unwrap()
                .catch(() => {
                    setToast({
                        text: "Произошла ошибка при загрузке жилья",
                        type: HintType.Error,
                    });
                });
        };

        fetchData();
    }, [currentPage, getHouses]);

    const handleOpenDeleteModal = (id: number, name: string) => {
        setHouseToDelete({ id, name });
    };

    const handleCloseDeleteModal = () => {
        setHouseToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!houseToDelete) return;

        try {
            await deleteSkill(houseToDelete.id).unwrap();
            setToast({
                text: "Жильё было успешно удалено",
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
                <ReactSVG src={getMediaContent(params.row.imagePath) ?? ""} className={styles.houseImg} />
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
                    getAdminHouseVacanciesPersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать жильё"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить жильё"
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
        if (!housesData) {
            return <span className={styles.text}>Жильё не было найдено</span>;
        }
        return (
            <DataGrid
                rows={housesData.data ?? []}
                columns={columns}
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
            />
        );
    };

    const totalPages = () => {
        if (!housesData) return 0;
        return Math.ceil(housesData.pagination.total / HOUSES_PER_PAGE);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h2>Таблица жилья</h2>
            <ButtonLink
                type="primary"
                className={styles.btn}
                path={getAdminHouseVacanciesCreatePageUrl(locale)}
            >
                Добавить жильё
            </ButtonLink>
            <div className={styles.table}>
                {renderTable()}
            </div>
            <OfferPagination
                currentPage={currentPage}
                totalPages={totalPages()}
                onPageChange={setCurrentPage}
            />
            <ConfirmActionModal
                isModalOpen={!!houseToDelete}
                description={`Вы уверены, что хотите удалить жильё "${houseToDelete?.name}"? Это действие нельзя отменить.`}
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
