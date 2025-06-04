import React, {
    FC, useEffect, useRef, useState,
} from "react";
import { IconButton, InputBase, Paper } from "@mui/material";
import { ReactSVG } from "react-svg";
import searchIcon from "@/shared/assets/icons/search-icon.svg";
import defaultImage from "@/shared/assets/images/default-offer-image.svg";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";
import { useCategories } from "@/shared/data/categories";
import { getOffersMapPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import styles from "./SearchOffers.module.scss";

interface SearchOffersProps {
    value?: string;
    onChange?: (value: string) => void;
}

export const SearchOffers: FC<SearchOffersProps> = () => {
    const [valueSearch, setValueSearch] = useState<string>("");
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { getTranslation } = useCategories();
    const { locale } = useLocale();

    const filteredOffers = mockedOffersData.filter(
        (offer) => offer.description?.title.toLowerCase().includes(valueSearch.toLowerCase()),
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputClick = () => {
        setDropdownVisible(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValueSearch(e.target.value);
        setDropdownVisible(true);
    };

    return (
        <div ref={containerRef} style={{ position: "relative" }}>
            <Paper
                sx={{
                    p: "3px 6px",
                    border: "1px solid var(--bg-field)",
                    display: "flex",
                    gap: "6px",
                    boxShadow: "none",
                    transition: "border-color 0.2s ease-in-out",
                    "&:focus-within": {
                        borderColor: "var(--accent-color)",
                    },
                }}
                component="form"
            >
                <InputBase
                    value={valueSearch}
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                    inputRef={inputRef}
                    sx={{ flex: 1, width: "100%" }}
                    placeholder="Поиск"
                    inputProps={{ "aria-label": "Поиск вакансий" }}
                />
                <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                    <ReactSVG className={styles.searchIcn} src={searchIcon} />
                </IconButton>
            </Paper>

            {dropdownVisible && valueSearch && filteredOffers.length > 0 && (
                <div className={styles.dropdown}>
                    {filteredOffers.map((offer) => (
                        <a
                            href={getOffersMapPageUrl(locale)}
                            key={offer.id}
                            className={styles.dropdownItem}
                        >
                            <img
                                src={offer.description?.image || defaultImage}
                                alt={offer.description?.title}
                            />
                            <div className={styles.dropdownContent}>
                                <p className={styles.offerTitle}>{offer.description?.title}</p>
                                <p className={styles.offerCategory}>
                                    {getTranslation(offer.description?.categoryIds[0])}
                                </p>
                            </div>
                        </a>
                    ))}
                    <ButtonLink
                        className={styles.button}
                        path={getOffersMapPageUrl(locale)}
                        type="primary"
                    >
                        Посмотреть все
                    </ButtonLink>
                </div>
            )}
        </div>
    );
};
