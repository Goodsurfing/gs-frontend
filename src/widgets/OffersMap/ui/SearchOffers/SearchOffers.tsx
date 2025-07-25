import React, {
    FC, memo, useCallback, useEffect, useRef, useState,
} from "react";
import { IconButton, InputBase, Paper } from "@mui/material";
import { ReactSVG } from "react-svg";
import cn from "classnames";
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

interface SearchOffersProps {
    onSubmit: () => void;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    buttonText?: string;
}

export const SearchOffers: FC<SearchOffersProps> = memo(({
    onSubmit,
    value,
    onChange,
    placeholder = "Поиск",
    buttonText = "Посмотреть все",
}: SearchOffersProps) => {
    const [fetchOffersDropdown, {
        data: offersDropdown,
        isLoading: offersDropdownIsLoading, isFetching: offersDropdownIsFetching,
    }] = useLazyGetOffersQuery(); // Нужно заменить на отдельный запрос от основного
    const isLoading = offersDropdownIsLoading || offersDropdownIsFetching;
    const [searchInput, setSearchInput] = useState<string>("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isDebouncing, setIsDebouncing] = useState(false);
    const debouncedValue = useDebounce(searchInput, 500);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { getTranslation } = useCategories();
    const { locale } = useLocale();

    useEffect(() => {
        setSearchInput(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (searchInput.trim().length > 0) {
            setIsDebouncing(true);
        } else {
            setDropdownVisible(false);
        }
    }, [searchInput]);

    useEffect(() => {
        if (debouncedValue.trim().length > 0) {
            setIsDebouncing(false);
            setDropdownVisible(true);
            onChange(debouncedValue);
            fetchOffersDropdown({ search: debouncedValue });
        }
    }, [debouncedValue, fetchOffersDropdown, onChange]);

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

    const handleSubmit = useCallback(() => {
        onSubmit();
        setDropdownVisible(false);
    }, [onSubmit]);

    const handleClear = useCallback(() => {
        setSearchInput("");
        onChange("");
        onSubmit();
    }, [onSubmit, onChange]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // onChange(e.target.value);
        setSearchInput(e.target.value);
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
            >
                <InputBase
                    value={searchInput}
                    onChange={handleInputChange}
                    onClick={() => setDropdownVisible(true)}
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
                {searchInput.length > 0 && <CloseButton onClick={handleClear} />}
                <IconButton onClick={handleSubmit} type="button" sx={{ p: "10px" }} aria-label="search">
                    <ReactSVG className={styles.searchIcn} src={searchIcon} />
                </IconButton>
            </Paper>

            {dropdownVisible && !!offersDropdown && offersDropdown.length > 0 && (
                <div className={styles.dropdown}>
                    {(isDebouncing || isLoading) ? (
                        <MiniLoader />
                    ) : (
                        <>
                            {offersDropdown.slice(0, 3).map((offer) => {
                                const offerStatus = offer.status === "active" ? "opened" : "closed";
                                return (
                                    <a
                                        href={getOffersMapPageUrl(locale)}
                                        key={offer.id}
                                        className={cn(styles.dropdownItem, { [styles.closed]: offerStatus === "closed" })}
                                    >
                                        <img
                                            src={getMediaContent(
                                                offer.description?.image,
                                            ) || defaultImage}
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
                                );
                            })}
                            <Button
                                onClick={handleSubmit}
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
});
