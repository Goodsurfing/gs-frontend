import React from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ReactSVG } from "react-svg";
import cn from "classnames";
import { DonationRatingSort } from "@/entities/Donation";
import { useLocale } from "@/app/providers/LocaleProvider";
import CustomLink from "@/shared/ui/Link/Link";
import sortDownIcon from "@/shared/assets/icons/donation/sort-down.svg";
import sortUpIcon from "@/shared/assets/icons/donation/sort-up.svg";
import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { SearchInput } from "@/shared/ui/SearchInput/SearchInput";
import { mockHostDonation } from "@/entities/Donation/data/mockDonations";
import { SelectRatingSort } from "../SelectRatingSort/SelectRatingSort";
import styles from "./HostDonationsTable.module.scss";

interface HostDonationRatingFields {
    filter: DonationRatingSort;
    sort: "asc" | "desc";
    search: string;
    searchDonation: string;
}

const defaultValues: DefaultValues<HostDonationRatingFields> = {
    filter: "numberDonations",
    sort: "desc",
};

export const HostDonationsTable = () => {
    const { locale } = useLocale();
    const form = useForm<HostDonationRatingFields>({
        mode: "onChange",
        defaultValues,
    });
    const {
        control,
    } = form;

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
            field: "author",
            headerName: "ФИО",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 280,
            renderCell: (params) => (
                <CustomLink
                    className={styles.link}
                    variant="DEFAULT"
                    target="_blank"
                    to={getVolunteerPersonalPageUrl(locale, params.row.id)}
                >
                    {params.row.author}
                </CustomLink>
            ),
        },
        {
            field: "nameDonation",
            headerName: "Название сбора",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
            width: 260,
        },
        {
            field: "totalAmountDonations",
            headerName: "Сумма пожертвования, руб.",
            width: 260,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            hideable: false,
        },
        {
            field: "date",
            headerName: "Дата",
            width: 200,
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
                    name="searchDonation"
                    control={control}
                    render={({ field }) => (
                        <SearchInput
                            sx={{ maxWidth: "370px" }}
                            value={field.value}
                            onChange={(value) => { field.onChange(value); }}
                            placeholder="Название сбора"
                        />
                    )}
                />
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
                <DataGrid
                    rows={mockHostDonation}
                    columns={columns}
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
