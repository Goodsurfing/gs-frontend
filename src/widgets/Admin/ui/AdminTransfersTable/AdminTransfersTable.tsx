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
import { useDeleteTransferMutation, useLazyGetTransfersQuery } from "@/entities/Admin";
import { getAdminTransferVacanciesCreatePageUrl, getAdminTransferVacanciesPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import styles from "./AdminTransfersTable.module.scss";

const TRANSFERS_PER_PAGE = 30;

export const AdminTransfersTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [transferToDelete, setTransferToDelete] = useState<
    { id: number; name: string } | null>(null);
    const [getTransfers, {
        data: transfersData,
        isLoading,
    }] = useLazyGetTransfersQuery();
    const [deleteTransfer, { isLoading: isDeleting }] = useDeleteTransferMutation();

    useEffect(() => {
        const fetchData = async () => {
            await getTransfers({
                page: currentPage,
                limit: TRANSFERS_PER_PAGE,
            }).unwrap()
                .catch(() => {
                    setToast({
                        text: "Произошла ошибка при загрузке оплачиваемого проезда",
                        type: HintType.Error,
                    });
                });
        };

        fetchData();
    }, [currentPage, getTransfers]);

    const handleOpenDeleteModal = (id: number, name: string) => {
        setTransferToDelete({ id, name });
    };

    const handleCloseDeleteModal = () => {
        setTransferToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!transferToDelete) return;

        try {
            await deleteTransfer(transferToDelete.id).unwrap();
            setToast({
                text: "Оплачиваемый проезд был успешно удален",
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
                <ReactSVG src={getMediaContent(params.row.imagePath) ?? ""} className={styles.transferImg} />
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
                    getAdminTransferVacanciesPersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать оплачиваемый проезд"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить оплачиваемый проезд"
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
        if (!transfersData) {
            return <span className={styles.text}>Оплачиваемый проезд не было найдено</span>;
        }
        return (
            <DataGrid
                rows={transfersData.data ?? []}
                columns={columns}
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
            />
        );
    };

    const totalPages = () => {
        if (!transfersData) return 0;
        return Math.ceil(transfersData.pagination.total / TRANSFERS_PER_PAGE);
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h2>Таблица оплачиваемого проезда</h2>
            <ButtonLink
                type="primary"
                className={styles.btn}
                path={getAdminTransferVacanciesCreatePageUrl(locale)}
            >
                Добавить оплачиваемый проезд
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
                isModalOpen={!!transferToDelete}
                description={`Вы уверены, что хотите удалить оплачиваемый проезд "${transferToDelete?.name}"? Это действие нельзя отменить.`}
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
