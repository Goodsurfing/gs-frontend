import React, { useMemo } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { SelectRatingSort } from "@/widgets/Donation";
import sortDownIcon from "@/shared/assets/icons/donation/sort-down.svg";
import sortUpIcon from "@/shared/assets/icons/donation/sort-up.svg";
import { SearchInput } from "@/shared/ui/SearchInput/SearchInput";
import { DonationRatingSort } from "@/entities/Donation";
import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import CustomLink from "@/shared/ui/Link/Link";
import { useGetDonationRatingQuery } from "@/store/api/donationPaymentApi";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./DonationRating.module.scss";

interface DonationRatingFields {
    filter: DonationRatingSort;
    sort: "asc" | "desc";
    search: string;
}

const defaultValues: DefaultValues<DonationRatingFields> = {
    filter: "numberDonations",
    sort: "desc",
};

export const DonationRating = () => {
    const { locale } = useLocale();
    const { isAuth } = useAuth();
    const { data: ratingData, isLoading } = useGetDonationRatingQuery({ limit: 100 });
    const form = useForm<DonationRatingFields>({
        mode: "onChange",
        defaultValues,
    });
    const {
        control,
        watch,
    } = form;

    const filterValue = watch("filter");
    const sortValue = watch("sort");
    const searchValue = watch("search");

    const rows = useMemo(() => {
        if (!ratingData) return [];

        let mapped = ratingData.map((item) => ({
            id: item.userId,
            name: item.userName,
            numberDonations: item.donationCount,
            totalAmountDonations: item.totalAmount,
        }));

        if (searchValue) {
            const q = searchValue.toLowerCase();
            mapped = mapped.filter((r) => r.name?.toLowerCase().includes(q) ?? false);
        }

        mapped.sort((a, b) => {
            const field = filterValue === "numberDonations" ? "numberDonations" : "totalAmountDonations";
            return sortValue === "asc" ? a[field] - b[field] : b[field] - a[field];
        });

        return mapped;
    }, [ratingData, filterValue, sortValue, searchValue]);

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
            headerName: "ФИО",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 340,
            renderCell: (params) => (isAuth ? (
                <CustomLink
                    className={styles.link}
                    variant="DEFAULT"
                    target="_blank"
                    to={getVolunteerPersonalPageUrl(locale, params.row.id)}
                >
                    {params.row.name}
                </CustomLink>
            ) : (
                <span>{params.row.name}</span>
            )),
        },
        {
            field: "numberDonations",
            headerName: "Количество пожертвований, руб.",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 260,
        },
        {
            field: "totalAmountDonations",
            headerName: "Общая сумма пожертвований, руб.",
            width: 260,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
    ];

    return (
        <div className={styles.wrapper}>
            <div className={styles.filters}>
                <div className={styles.filtersLeft}>
                    <Controller
                        name="filter"
                        control={control}
                        render={({ field }) => (
                            <SelectRatingSort
                                value={field.value}
                                onChange={field.onChange}
                                classNameDropdown={styles.dropdown}
                                className={styles.sort}
                            />
                        )}
                    />
                    <Controller
                        name="sort"
                        control={control}
                        render={({ field }) => (
                            <div className={styles.sortWrapper}>
                                <button
                                    type="button"
                                    aria-label="По убыванию"
                                    className={cn(styles.sort, { [styles.active]: field.value === "desc" })}
                                    onClick={() => field.onChange("desc")}
                                >
                                    <ReactSVG src={sortDownIcon} />
                                </button>
                                <button
                                    type="button"
                                    aria-label="По возрастанию"
                                    className={cn(styles.sort, { [styles.active]: field.value === "asc" })}
                                    onClick={() => field.onChange("asc")}
                                >
                                    <ReactSVG src={sortUpIcon} />
                                </button>
                            </div>
                        )}
                    />
                </div>
                <Controller
                    name="search"
                    control={control}
                    render={({ field }) => (
                        <SearchInput
                            sx={{ maxWidth: "370px" }}
                            value={field.value}
                            onChange={(value) => { field.onChange(value); }}
                            placeholder="Поиск участника"
                        />
                    )}
                />
            </div>
            <div className={styles.table}>
                {isLoading && <MiniLoader />}
                <DataGrid
                    rows={rows}
                    columns={columns}
                    columnVisibilityModel={{ id: isAuth }}
                    loading={isLoading}
                    sx={{
                        border: 0,
                        "& .MuiDataGrid-columnHeaderTitle": {
                            fontWeight: 700,
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            background: "#ECF1F4",
                        },
                    }}
                    rowsPerPageOptions={[]}
                    disableSelectionOnClick
                    hideFooter
                />
            </div>
        </div>
    );
};
