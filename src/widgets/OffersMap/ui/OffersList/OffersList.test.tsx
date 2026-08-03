import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OffersList } from "./OffersList";
import { OfferApi } from "@/entities/Offer";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("../HeaderList/HeaderList", () => ({
    HeaderList: () => <div data-testid="header-list" />,
}));

vi.mock("../OfferPagination/OfferPagination", () => ({
    OfferPagination: () => <div data-testid="offer-pagination" />,
}));

vi.mock("../OfferCard/OfferCard", () => ({
    OfferCard: ({ data }: { data: { id: number } }) => (
        <div data-testid={`offer-card-${data.id}`} />
    ),
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

const renderList = (props: Partial<React.ComponentProps<typeof OffersList>> = {}) => render(
    <OffersList
        mapOpenValue
        onChangeMapOpen={() => {}}
        data={[offer(1)]}
        isLoading={false}
        currentPage={1}
        offersPerPage={20}
        total={1}
        onChangePage={() => {}}
        {...props}
    />,
);

describe("OffersList", () => {
    it(
        "показывает отдельное сообщение об ошибке загрузки (регресс: реальный сбой запроса "
        + "500/обрыв сети выглядел так же, как «вакансии не были найдены» — человек решал, что "
        + "раздела просто нет, вместо того чтобы попробовать обновить страницу)",
        () => {
            renderList({ isError: true, data: undefined });

            expect(screen.getByText("Не удалось загрузить вакансии")).toBeInTheDocument();
            expect(screen.queryByText("Вакансии не были найдены")).not.toBeInTheDocument();
        },
    );

    it("не показывает ошибку, если данные загрузились штатно", () => {
        renderList();

        expect(screen.queryByText("Не удалось загрузить вакансии")).not.toBeInTheDocument();
        expect(screen.getByTestId("offer-card-1")).toBeInTheDocument();
    });

    it("кнопка «Попробовать снова» вызывает onRetry", async () => {
        const onRetry = vi.fn();
        renderList({ isError: true, data: undefined, onRetry });

        await userEvent.click(screen.getByText("Попробовать снова"));

        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("показывает спиннер, а не ошибку, пока идёт обычная загрузка (isError не задан)", () => {
        renderList({ isLoading: true, data: undefined });

        expect(screen.queryByText("Не удалось загрузить вакансии")).not.toBeInTheDocument();
    });
});
