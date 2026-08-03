import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { OfferApi } from "@/entities/Offer";
import { OffersSearchFilterMobile } from "./OffersSearchFilterMobile";

const latestOffersMapProps: { current: Record<string, unknown> } = { current: {} };

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/widgets/OffersMap", () => ({
    OfferPagination: () => <div />,
    OffersMap: (props: Record<string, unknown>) => {
        latestOffersMapProps.current = props;
        return <div data-testid="offers-map" />;
    },
    SwitchClosedOffers: () => <div />,
}));

vi.mock("@/widgets/OffersMap/ui/OfferCard/OfferCard", () => ({
    OfferCard: ({
        data, isSelected, onSelect,
    }: {
        data: { id: number };
        isSelected?: boolean;
        onSelect?: (id: number) => void;
    }) => (
        <button
            type="button"
            data-testid={`offer-card-${data.id}`}
            data-selected={isSelected ? "true" : "false"}
            onClick={() => onSelect?.(data.id)}
        >
            offer
            {data.id}
        </button>
    ),
}));

vi.mock("@/widgets/OffersMap/ui/SearchOffers/SearchOffers", () => ({
    SearchOffers: () => <div />,
}));

vi.mock("@/widgets/OffersMap/ui/SelectSort/SelectSort", () => ({
    SelectSort: () => <div />,
}));

vi.mock("../OffersMobileFilter/OffersMobileFilter", () => ({
    OffersMobileFilter: () => <div />,
}));

const offer = (id: number): OfferApi => ({
    id,
    title: `Test offer ${id}`,
    shortDescription: "",
    image: null,
    categories: [],
    address: "",
    acceptedApplicationsCount: 0,
    averageRating: 0,
    reviewsCount: 0,
    status: "active" as const,
    organization: {
        id: "1", name: "", type: "", otherType: "", shortDescription: "", image: { id: "1", contentUrl: "" },
    },
    isFullYearAcceptable: false,
    isApplicableAtTheEnd: false,
    durationMinDays: 0,
    durationMaxDays: 0,
    applicationEndDate: "",
    periods: [],
    updated: "",
});

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const form = useForm();
    return <FormProvider {...form}>{children}</FormProvider>;
};

type MobileProps = Partial<React.ComponentProps<typeof OffersSearchFilterMobile>>;

const renderMobile = (props: MobileProps = {}) => render(
    <Wrapper>
        <OffersSearchFilterMobile
            allOffersMapData={[]}
            isLoadingAllOffersMap={false}
            data={[offer(1)]}
            isLoading={false}
            onApplySearch={() => {}}
            onSubmit={() => {}}
            onResetFilters={() => {}}
            total={1}
            currentPage={1}
            offersPerPage={20}
            onChangePage={() => {}}
            {...props}
        />
    </Wrapper>,
);

describe("OffersSearchFilterMobile", () => {
    it(
        "открывает вкладку карты сразу, если вакансия уже выбрана через URL (регресс: клик по вакансии в списке "
        + "никогда не подсвечивал/не центрировал мобильную карту — onSelect/selectedOfferId/selectedOfferCoordinates "
        + "просто не были подключены к мобильному дереву)",
        () => {
            renderMobile({ selectedOfferId: 42 });

            expect(screen.getByTestId("offers-map")).toBeInTheDocument();
            expect(latestOffersMapProps.current.selectedOfferId).toBe(42);
        },
    );

    it("по умолчанию (без выбранной вакансии) открывает вкладку списка, а не карты", () => {
        renderMobile();

        expect(screen.queryByTestId("offers-map")).not.toBeInTheDocument();
        expect(screen.getByTestId("offer-card-1")).toBeInTheDocument();
    });

    it("клик по карточке в списке вызывает onSelectOffer и переключает на вкладку карты", async () => {
        const onSelectOffer = vi.fn();
        renderMobile({ onSelectOffer });

        await userEvent.click(screen.getByTestId("offer-card-1"));

        expect(onSelectOffer).toHaveBeenCalledWith(1);
        expect(screen.getByTestId("offers-map")).toBeInTheDocument();
    });

    it("передаёт selectedOfferId/selectedOfferCoordinates в мобильную OffersMap, чтобы карта могла "
        + "сфокусироваться и открыть balloon", () => {
        const coordinates = { latitude: 55.75, longitude: 37.61 };
        renderMobile({ selectedOfferId: 7, selectedOfferCoordinates: coordinates });

        expect(latestOffersMapProps.current.selectedOfferId).toBe(7);
        expect(latestOffersMapProps.current.selectedOfferCoordinates).toBe(coordinates);
    });

    it("отмечает выбранную карточку как isSelected", async () => {
        renderMobile({ selectedOfferId: 1 });

        // карта открыта по умолчанию (т.к. selectedOfferId задан) — переключаемся на список
        await userEvent.click(screen.getByText("Список вакансий"));

        expect(screen.getByTestId("offer-card-1")).toHaveAttribute("data-selected", "true");
    });

    it("передаёт onBoundsChange в мобильную OffersMap (регресс: без него мобильная карта грузит "
        + "весь неограниченный набор маркеров вместо viewport-scoped, из-за чего ObjectManager не успевает "
        + "зарегистрировать маркер в бюджете ретраев открытия balloon)", () => {
        const onBoundsChange = vi.fn();
        renderMobile({ selectedOfferId: 1, onBoundsChange });

        expect(latestOffersMapProps.current.onBoundsChange).toBe(onBoundsChange);
    });

    it("показывает отдельное сообщение об ошибке списка (не «вакансий не были найдены») и вызывает onRetry "
        + "по кнопке", async () => {
        const onRetry = vi.fn();
        renderMobile({ isError: true, data: undefined, onRetry });

        expect(screen.getByText("Не удалось загрузить вакансии")).toBeInTheDocument();
        expect(screen.queryByText("Вакансии не были найдены")).not.toBeInTheDocument();

        await userEvent.click(screen.getByText("Попробовать снова"));
        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("передаёт isMapError/onRetryMap в мобильную OffersMap как isOffersError/onRetry", () => {
        const onRetryMap = vi.fn();
        renderMobile({ selectedOfferId: 1, isMapError: true, onRetryMap });

        expect(latestOffersMapProps.current.isOffersError).toBe(true);
        expect(latestOffersMapProps.current.onRetry).toBe(onRetryMap);
    });
});
