import React, {
    FC, useEffect, useRef, useState,
} from "react";
import { IconButton, InputBase, Paper } from "@mui/material";
import { ReactSVG } from "react-svg";
import { useFormContext, useWatch } from "react-hook-form";
import searchIcon from "@/shared/assets/icons/search-icon.svg";
import defaultImage from "@/shared/assets/images/default-offer-image.svg";
import { useCategories } from "@/shared/data/categories";
import { getOffersMapPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./SearchOffers.module.scss";
import { useLazyGetOffersQuery } from "@/entities/Offer";
import useDebounce from "@/shared/hooks/useDebounce";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import Button from "@/shared/ui/Button/Button";
import { CloseButton } from "@/shared/ui/CloseButton/CloseButton";
import { OffersFilterFields } from "@/pages/OffersMapPage/model/types";
import { offersFilterApiAdapter } from "@/pages/OffersMapPage/lib/offersFilterAdapter";

interface SearchOffersProps {
    onSubmit: () => void;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    buttonText?: string;
}

export const SearchOffers: FC<SearchOffersProps> = (props) => {
    const {
        onSubmit,
        value, onChange,
        placeholder = "Поиск", buttonText = "Посмотреть все",
    } = props;

    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [isDebouncing, setIsDebouncing] = useState(false);
    const debouncedValue = useDebounce(value, 500);

    const { control } = useFormContext<OffersFilterFields>();
    const offersFilters = useWatch({ control }) as OffersFilterFields;

    const [getOffers, { data: offersData, isLoading }] = useLazyGetOffersQuery();

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { getTranslation } = useCategories();
    const { locale } = useLocale();

    useEffect(() => {
        if (value.trim().length > 0) {
            setIsDebouncing(true);
        } else {
            setDropdownVisible(false);
        }
    }, [value]);

    useEffect(() => {
        if (debouncedValue.trim().length > 0) {
            setIsDebouncing(false);
            const preparedData = offersFilterApiAdapter(offersFilters);
            getOffers({ ...preparedData, search: debouncedValue.toLowerCase() });
            setDropdownVisible(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, getOffers]);

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

    const handleSubmit = () => {
        onSubmit();
        setDropdownVisible(false);
    };

    const handleClear = () => {
        onChange("");
        onSubmit();
    };

    const handleInputClick = () => {
        setDropdownVisible(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setDropdownVisible(true);
    };

    const filteredOffers = offersData?.slice(0, 3) || [];

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
            >
                <InputBase
                    value={value}
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                    inputRef={inputRef}
                    sx={{ flex: 1, width: "100%" }}
                    placeholder={placeholder}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                    inputProps={{ "aria-label": "Поиск вакансий" }}
                />
                {value.length > 0 && <CloseButton onClick={() => handleClear()} />}
                <IconButton onClick={() => handleSubmit()} type="button" sx={{ p: "10px" }} aria-label="search">
                    <ReactSVG className={styles.searchIcn} src={searchIcon} />
                </IconButton>
            </Paper>

            {dropdownVisible && value && filteredOffers.length > 0 && (
                <div className={styles.dropdown}>
                    {(isDebouncing || isLoading) ? (<MiniLoader />) : (
                        <>
                            {filteredOffers.map((offer) => (
                                <a
                                    href={getOffersMapPageUrl(locale)}
                                    key={offer.id}
                                    className={styles.dropdownItem}
                                >
                                    <img
                                        src={getMediaContent(offer.description?.image)
                                            || defaultImage}
                                        alt={offer.description?.title}
                                    />
                                    <div className={styles.dropdownContent}>
                                        <p className={styles.offerTitle}>
                                            {
                                                offer.description?.title
                                            }
                                        </p>
                                        <p className={styles.offerCategory}>
                                            {getTranslation(offer.description?.categoryIds[0])}
                                        </p>
                                    </div>
                                </a>
                            ))}
                            <Button
                                onClick={() => handleSubmit()}
                                color="BLUE"
                                size="SMALL"
                                variant="FILL"
                            >
                                {buttonText}
                            </Button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
