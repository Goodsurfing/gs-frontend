import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import { OfferPagination } from "@/widgets/OffersMap";
import { getAdminCategoriesVacanciesPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import showIcon from "@/shared/assets/icons/admin/show.svg";
import deleteIcon from "@/shared/assets/icons/admin/delete.svg";
import { useLazyGetCategoriesVacancyQuery } from "@/entities/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./AdminCategoriesTable.module.scss";

const CATEGORIES_PER_PAGE = 30;

export const AdminCategoriesTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [getCategories, {
        data: categoriesData,
        isLoading,
    }] = useLazyGetCategoriesVacancyQuery();

    useEffect(() => {
        const fetchData = async () => {
            await getCategories({
                page: currentPage,
                limit: CATEGORIES_PER_PAGE,
            }).unwrap();
        };

        fetchData();
    }, [currentPage, getCategories]);

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", disableColumnMenu: false },
        {
            field: "name", headerName: "Название", disableColumnMenu: false, width: 240,
        },
        {
            field: "color",
            headerName: "Цвет",
            disableColumnMenu: false,
            width: 240,
            renderCell: (params) => (
                <div className={cn(styles.color)}>
                    <span>{params.row.color}</span>
                    <div
                        className={styles.colorItem}
                        style={{ backgroundColor: params.row.color }}
                    />
                </div>
            ),
        },
        {
            field: "imagePath",
            headerName: "Картинка",
            sortable: true,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 180,
            renderCell: (params) => (
                <ReactSVG className={styles.skillImg} src={params.row.img} />
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
                    getAdminCategoriesVacanciesPersonalPageUrl(locale, params.row.id),
                );
                const handleDelete = () => alert(`Удалить категорию ${params.row.id}?`);

                return (
                    <Stack direction="row" spacing={1}>
                        <button
                            onClick={handleView}
                            type="button"
                            title="Редактировать категорию"
                            className={cn(styles.btnIcon, styles.btnShow)}
                        >
                            <ReactSVG src={showIcon} />
                        </button>
                        <button
                            onClick={handleDelete}
                            type="button"
                            title="Удалить категорию"
                            className={cn(styles.btnIcon, styles.btnDelete)}
                        >
                            <ReactSVG src={deleteIcon} />
                        </button>
                    </Stack>
                );
            },
        },
    ];

    if (!categoriesData || isLoading) {
        return (
            <MiniLoader />
        );
    }

    const totalPages = Math.ceil(categoriesData.pagination.total / CATEGORIES_PER_PAGE);

    return (
        <div className={styles.wrapper}>
            <DataGrid
                rows={categoriesData?.data ?? []}
                columns={columns}
                sx={{ border: 0 }}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
            />
            <OfferPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};
