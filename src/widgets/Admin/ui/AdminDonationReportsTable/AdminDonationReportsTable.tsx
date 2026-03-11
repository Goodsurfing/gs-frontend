import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    Stack,
} from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    useDeleteAdminDonationReportMutation, useGetAdminDonationReportsQuery,
} from "@/entities/Admin";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getAdminDonationReportCreatePageUrl, getAdminDonationReportPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import styles from "./AdminDonationReportsTable.module.scss";

export const AdminDonationReportsTable = () => {
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [offerToDelete, setOfferToDelete] = useState<
    { id: string; name: string } | null>(null);
    const {
        data: reportsData,
        isLoading,
        isFetching,
        isError,
    } = useGetAdminDonationReportsQuery();
    const [deleteReport, { isLoading: isDeleting }] = useDeleteAdminDonationReportMutation();

    useEffect(() => {
        if (isError) {
            setToast({
                text: "Произошла ошибка при загрузке отчётов",
                type: HintType.Error,
            });
        }
    }, [isError]);

    const handleOpenDeleteModal = (id: string, name: string) => {
        setOfferToDelete({ id, name });
    };

    const handleCloseDeleteModal = () => {
        setOfferToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setToast(undefined);
        if (!offerToDelete) return;

        try {
            await deleteReport(offerToDelete.id).unwrap();
            setToast({
                text: "Отчёт был успешно удален",
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
            field: "actions",
            headerName: "Действия",
            width: 160,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            renderCell: (params) => {
                const handleView = () => navigate(
                    getAdminDonationReportPersonalPageUrl(locale, params.row.id),
                );
                const handleDeleteClick = () => {
                    handleOpenDeleteModal(params.row.id, params.row.name || `ID: ${params.row.id}`);
                };

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать отчёт"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            title="Удалить отчёт"
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
        if (!reportsData) {
            return <span className={styles.text}>Отчёты не были найдены</span>;
        }
        const adaptedData: any[] = reportsData.map((report) => {
            const {
                id, name,
            } = report;
            return {
                id,
                name,
            };
        });
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
                <ButtonLink
                    path={getAdminDonationReportCreatePageUrl(locale)}
                    type="primary"
                    className={styles.btn}
                >
                    Добавить отчёт
                </ButtonLink>
            </div>
            <div className={styles.table}>
                {renderTable()}
            </div>
            <ConfirmActionModal
                isModalOpen={!!offerToDelete}
                description={`Вы уверены, что хотите удалить вакансию "${offerToDelete?.name}"? Это действие нельзя отменить.`}
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
