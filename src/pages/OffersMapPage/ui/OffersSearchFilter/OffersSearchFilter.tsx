/* eslint-disable react-hooks/exhaustive-deps */
import cn from "classnames";
import React, {
    useCallback, useEffect, useMemo, useRef, useState,
} from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { OffersList, OffersMap } from "@/widgets/OffersMap";
import type { MapViewportBounds } from "@/widgets/OffersMap/ui/OffersMap/OffersMap";

import { OffersFilterFields } from "../../model/types";
import { OffersFilter } from "../OffersFilter/OffersFilter";
import { OffersSearchFilterMobile } from "../OffersSearchFilterMobile/OffersSearchFilterMobile";
import { OfferSort, useLazyGetAllOffersMapQuery, useLazyGetOffersQuery } from "@/entities/Offer";
import { getCategoryIdsFromUrlParam, getCategoryUrlParamFromIds } from "../../lib/categoryUrlParams";
import { offersFilterApiAdapter } from "../../lib/offersFilterAdapter";
import { SearchOffers, SearchOffersRef } from "@/widgets/OffersMap/ui/SearchOffers/SearchOffers";
import styles from "./OffersSearchFilter.module.scss";

const defaultValues: OffersFilterFields = {
    offersSort: {
        showClosedOffers: true,
        sortValue: "novelty",
    },
    category: [],
    languages: [],
    participationPeriod: [1, 190],
    periods: { start: undefined, end: undefined },
    withChildren: false,
    provided: [],
};

const defaultFilterValues: DefaultValues<OffersFilterFields> = defaultValues;

const OFFERS_PER_PAGE = 20;

export const OffersSearchFilter = () => {
    const [isMapOpened, setMapOpened] = useState<boolean>(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [fetchOffers, { data: offersData, isLoading, isFetching }] = useLazyGetOffersQuery();
    const [fetchAllOffersMap,
        {
            data: allOffersMap = [], isLoading: isAllOffersMapLoading,
            isFetching: isAllOffersMapFetching,
        }] = useLazyGetAllOffersMapQuery();
    // Отдельный вызов того же эндпоинта по конкретным id вместо bounds —
    // даёт координаты/наличие локации именно для карточек текущей страницы
    // списка, независимо от того, что сейчас видно в viewport карты. Без
    // этого нельзя было бы отличить "у вакансии правда нет координат" от
    // "координаты есть, но карта сейчас смотрит в другое место".
    const [fetchPageOffersLocation, {
        data: pageOffersLocation = [], isFetching: isPageLocationFetching,
    }] = useLazyGetAllOffersMapQuery();
    const mapBoundsRef = useRef<MapViewportBounds | null>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { t } = useTranslation("offers-map");
    const searchRef = useRef<SearchOffersRef>(null);

    // Восстанавливаем страницу списка и выбранную карточку из URL — иначе при
    // возврате кнопкой "назад" со страницы вакансии (открытой из списка или с
    // карты) React Router размонтирует эту страницу заново, и весь локальный
    // state (currentPage, selectedOfferId) сбрасывается к дефолту, хотя
    // category/search такого не делают именно потому, что живут в URL.
    const [currentPage, setCurrentPage] = useState<number>(
        () => Number(searchParams.get("page")) || 1,
    );
    const [initialSearchValue, setInitialSearchValue] = useState<string>();
    const [selectedOfferId, setSelectedOfferId] = useState<number | undefined>(() => {
        const offerIdParam = searchParams.get("offerId");
        return offerIdParam ? Number(offerIdParam) : undefined;
    });

    const initialCategories = getCategoryIdsFromUrlParam(searchParams.get("category") ?? "");

    const offerFilterForm = useForm<OffersFilterFields>({
        mode: "onChange",
        defaultValues: {
            ...defaultFilterValues,
            category: initialCategories,
        },
    });

    const {
        watch, setValue, reset, handleSubmit,
    } = offerFilterForm;

    const isSyncingRef = useRef(false);
    const isInternalCategoryPushRef = useRef(false);
    const previousCategoryParamRef = useRef(searchParams.get("category"));
    const currentSearchRef = useRef<string>("");

    const fetchOffersMapWithBounds = useCallback((params: Record<string, unknown>) => {
        fetchAllOffersMap({ ...params, ...(mapBoundsRef.current ?? {}) });
    }, [fetchAllOffersMap]);

    const handleBoundsChange = useCallback((bounds: MapViewportBounds) => {
        mapBoundsRef.current = bounds;

        const watchData = watch();
        const preparedData = offersFilterApiAdapter(watchData);
        if (currentSearchRef.current) {
            fetchOffersMapWithBounds({ search: currentSearchRef.current });
        } else {
            fetchOffersMapWithBounds({ ...preparedData });
        }
    }, [watch, fetchOffersMapWithBounds]);

    useEffect(() => {
        if (currentSearchRef.current) {
            fetchOffers({
                sort: OfferSort.UpdatedDesc,
                search: currentSearchRef.current,
                limit: OFFERS_PER_PAGE,
                page: currentPage,
            });
        } else {
            const watchData = watch();
            const preparedData = offersFilterApiAdapter(watchData);
            fetchOffers({ ...preparedData, limit: OFFERS_PER_PAGE, page: currentPage });
        }
    }, [currentPage]);

    useEffect(() => {
        const watchData = watch();
        const preparedData = offersFilterApiAdapter(watchData);
        fetchOffersMapWithBounds({ ...preparedData });
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (!isSyncingRef.current && name === "category") {
                const newCategory = getCategoryUrlParamFromIds(value.category);
                isInternalCategoryPushRef.current = true;
                setSearchParams((prev) => {
                    const updated = new URLSearchParams(prev);
                    if (newCategory) {
                        updated.set("category", newCategory);
                    } else {
                        updated.delete("category");
                    }
                    return updated;
                }, { replace: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, setSearchParams]);

    useEffect(() => {
        isSyncingRef.current = true;

        const categoryParam = searchParams.get("category");
        const parsedCategories = getCategoryIdsFromUrlParam(categoryParam ?? "");
        setValue("category", parsedCategories);

        const categoryParamChanged = categoryParam !== previousCategoryParamRef.current;
        previousCategoryParamRef.current = categoryParam;

        // A category change that we didn't push ourselves (e.g. the "Все вакансии"
        // nav link, a Back/Forward navigation, or a shared URL) means the visible
        // list needs to be re-applied immediately, same as clicking "Применить" —
        // otherwise the URL/form reset but the displayed results stay stale.
        const isExternalCategoryChange = categoryParamChanged
            && !isInternalCategoryPushRef.current
            && !currentSearchRef.current;

        if (isExternalCategoryChange) {
            const preparedData = offersFilterApiAdapter({ ...watch(), category: parsedCategories });
            fetchOffers({ ...preparedData, limit: OFFERS_PER_PAGE, page: 1 });
            fetchOffersMapWithBounds({ ...preparedData });
            setCurrentPage(1);
        }
        isInternalCategoryPushRef.current = false;

        isSyncingRef.current = false;
    }, [searchParams, setValue]);

    const onChangePage = useCallback((pageItem: number) => {
        setCurrentPage(pageItem);
        // Выделенная карточка принадлежит текущей странице списка — при
        // переходе на другую страницу она пропадает из виду, так что и
        // выбор логично сбрасывать (заодно не даёт селекту "залипнуть" на
        // id, для которого больше нет свежих данных о координатах).
        setSelectedOfferId(undefined);
        setSearchParams((prev) => {
            const updated = new URLSearchParams(prev);
            if (pageItem > 1) {
                updated.set("page", String(pageItem));
            } else {
                updated.delete("page");
            }
            updated.delete("offerId");
            return updated;
        }, { replace: true });
    }, [setSearchParams]);

    const onApplySearch = useCallback(async (search: string) => {
        currentSearchRef.current = search;
        const params = new URLSearchParams();
        if (search) {
            params.set("search", search);
        }
        setSearchParams(params);
        fetchOffers({
            sort: OfferSort.UpdatedDesc, search, limit: OFFERS_PER_PAGE, page: 1,
        });
        fetchOffersMapWithBounds({ search });
        reset(defaultValues);
        onChangePage(1);
        // onChangePage must stay in deps: it closes over setSearchParams via a
        // functional updater, and setSearchParams is recreated on every URL
        // change — an empty deps array here would freeze this handler on the
        // mount-time onChangePage/setSearchParams forever, so its updater's
        // `prev` would always resolve to whatever searchParams existed on
        // page load, silently reintroducing them on every apply/reset click.
    }, [onChangePage]);

    useEffect(() => {
        const searchParam = searchParams.get("search");
        if (searchParam) {
            onApplySearch(searchParam);
            setInitialSearchValue(searchParam);
        }
        // Only restore search from the URL on initial load — onApplySearch itself
        // keeps the URL in sync afterwards, so re-running this on every
        // searchParams change would re-trigger the same search and push
        // duplicate history entries.
    }, []);

    const onApplyFilters = useCallback(handleSubmit(async (data: OffersFilterFields) => {
        currentSearchRef.current = "";
        // "Применить" drops any active text search (search and
        // category/date/etc. filters aren't combined) — without clearing the
        // input too, it kept showing the old query while results were
        // silently no longer filtered by it, e.g. searching "Байкал" then
        // applying a category showed unrelated results with "Байкал" still
        // sitting in the search box.
        searchRef.current?.clearSearch();
        const preparedData = offersFilterApiAdapter(data);
        fetchOffers({ ...preparedData, limit: OFFERS_PER_PAGE, page: 1 });
        fetchOffersMapWithBounds({ ...preparedData });
        onChangePage(1);
        // See onApplySearch above for why onChangePage can't be omitted here —
        // this is exactly the bug that made "Применить" resurrect a category
        // the user had just unchecked (GS staging report, 2026-07-29).
    }), [onChangePage]);

    const onResetFilters = useCallback(async () => {
        currentSearchRef.current = "";
        setSearchParams(new URLSearchParams());
        searchRef.current?.clearSearch();
        const preparedData = offersFilterApiAdapter(defaultValues);
        fetchOffers({ ...preparedData, limit: OFFERS_PER_PAGE, page: 1 });
        fetchOffersMapWithBounds({ ...preparedData });
        reset(defaultValues);
        onChangePage(1);
    }, [onChangePage]);

    const handleMapOpen = useCallback(() => {
        setMapOpened((prev) => !prev);
    }, []);

    const handleSelectOffer = useCallback((offerId: number) => {
        setSelectedOfferId(offerId);
        // Пишем в URL, чтобы кнопка "назад" со страницы вакансии (открытой
        // и из списка, и с карты) вернула пользователя к тому же
        // выделенному элементу, а не к чистому списку — см. fetchPageOffersLocation
        // ниже, который подтягивает координаты именно по этому id.
        setSearchParams((prev) => {
            const updated = new URLSearchParams(prev);
            updated.set("offerId", String(offerId));
            return updated;
        }, { replace: true });
    }, [setSearchParams]);

    useEffect(() => {
        const ids = offersData?.data.map((offer) => offer.id) ?? [];
        // selectedOfferId может не входить в текущую страницу списка — например,
        // он был выбран кликом по маркеру на карте, а не карточкой из списка.
        // Без этого координаты для восстановления после навигации "назад"
        // никогда бы не подтянулись.
        if (selectedOfferId && !ids.includes(selectedOfferId)) {
            ids.push(selectedOfferId);
        }
        if (ids.length > 0) {
            fetchPageOffersLocation({ ids });
        }
    }, [offersData?.data, selectedOfferId]);

    const offerIdsWithoutLocation = useMemo(() => {
        if (isPageLocationFetching) return new Set<number>();

        const withLocation = new Set(pageOffersLocation.map((offer) => offer.id));
        return new Set(
            (offersData?.data ?? [])
                .map((offer) => offer.id)
                .filter((id) => !withLocation.has(id)),
        );
    }, [pageOffersLocation, offersData?.data, isPageLocationFetching]);

    const selectedOfferCoordinates = useMemo(() => {
        if (!selectedOfferId || isPageLocationFetching) return undefined;

        const match = pageOffersLocation.find((offer) => offer.id === selectedOfferId);
        if (!match) return null;

        return { latitude: match.latitude, longitude: match.longitude };
    }, [selectedOfferId, pageOffersLocation, isPageLocationFetching]);

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if ((name === "offersSort.showClosedOffers" || name === "offersSort.sortValue") && type === "change") {
                if (debounceTimeoutRef.current) {
                    clearTimeout(debounceTimeoutRef.current);
                }

                debounceTimeoutRef.current = setTimeout(() => {
                    const preparedData = offersFilterApiAdapter(value as OffersFilterFields);
                    if (currentSearchRef.current) {
                        fetchOffers({
                            ...preparedData,
                            search: currentSearchRef.current,
                            limit: OFFERS_PER_PAGE,
                            page: currentPage,
                        });
                        fetchOffersMapWithBounds({
                            ...preparedData, search: currentSearchRef.current,
                        });
                    } else {
                        fetchOffers({ ...preparedData, limit: OFFERS_PER_PAGE, page: currentPage });
                        fetchOffersMapWithBounds({ ...preparedData });
                    }
                }, 300);
            }
        });

        return () => {
            subscription.unsubscribe();
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    return (
        <FormProvider {...offerFilterForm}>
            <div className={styles.wrapper}>
                <OffersFilter
                    onSubmit={onApplyFilters}
                    onResetFilters={onResetFilters}
                    className={styles.filter}
                />
                <div className={styles.wrapperOffersMap}>
                    <div className={cn(styles.searchOffersList, {
                        [styles.closed]: !isMapOpened,
                    })}
                    >
                        <SearchOffers
                            className={styles.searchWrapper}
                            onSubmit={onApplySearch}
                            onResetFilters={onResetFilters}
                            placeholder={t("Поиск")}
                            buttonText={t("Посмотреть все")}
                            ref={searchRef}
                            initialValue={initialSearchValue}
                        />
                        <OffersList
                            data={offersData?.data}
                            isLoading={isLoading || isFetching}
                            className={cn(styles.offersList)}
                            onChangeMapOpen={handleMapOpen}
                            mapOpenValue={isMapOpened}
                            currentPage={currentPage}
                            offersPerPage={OFFERS_PER_PAGE}
                            onChangePage={onChangePage}
                            total={offersData?.pagination.total ?? 0}
                            selectedOfferId={selectedOfferId}
                            onSelectOffer={handleSelectOffer}
                            offerIdsWithoutLocation={offerIdsWithoutLocation}
                        />
                    </div>
                    {isMapOpened && (
                        <OffersMap
                            offersData={allOffersMap}
                            isOffersLoading={isAllOffersMapLoading || isAllOffersMapFetching}
                            className={styles.offersMap}
                            classNameMap={styles.offersMap}
                            selectedOfferId={selectedOfferId}
                            selectedOfferCoordinates={selectedOfferCoordinates}
                            onBoundsChange={handleBoundsChange}
                        />
                    )}
                </div>
                <OffersSearchFilterMobile
                    data={offersData?.data}
                    allOffersMapData={allOffersMap}
                    isLoadingAllOffersMap={isAllOffersMapLoading || isAllOffersMapFetching}
                    isLoading={isLoading || isFetching}
                    className={styles.mobile}
                    onApplySearch={onApplySearch}
                    onSubmit={onApplyFilters}
                    onResetFilters={onResetFilters}
                    currentPage={currentPage}
                    offersPerPage={OFFERS_PER_PAGE}
                    total={offersData?.pagination.total ?? 0}
                    onChangePage={onChangePage}
                    selectedOfferId={selectedOfferId}
                    onSelectOffer={handleSelectOffer}
                    selectedOfferCoordinates={selectedOfferCoordinates}
                    offerIdsWithoutLocation={offerIdsWithoutLocation}
                    onBoundsChange={handleBoundsChange}
                />
            </div>
        </FormProvider>
    );
};
