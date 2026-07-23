import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { renderWithProviders } from "@/test-utils";
import { OffersFilter } from "./OffersFilter";

vi.mock("@/widgets/OffersMap", () => ({
    Categories: React.forwardRef((_props: any, ref: any) => <div ref={ref} />),
    ExtraFilters: () => <div />,
}));
vi.mock("@/widgets/OffersMap/ui/ButtonFilter/ButtonFilter", () => ({
    ButtonFilter: () => <div />,
}));
vi.mock("@/widgets/OffersMap/ui/ParticipationPeriod/ParticipationPeriod", () => ({
    ParticipationPeriod: () => <div />,
}));
vi.mock("@/widgets/OffersMap/ui/PeriodsFilter/PeriodsFilter", () => ({
    PeriodsFilter: ({ onChange }: { onChange: (v: unknown) => void }) => (
        <input aria-label="Не задано" onChange={() => onChange({ start: undefined, end: undefined })} />
    ),
}));

interface WrapperProps {
    onSubmit: () => void;
    onResetFilters: () => void;
}

const Wrapper = ({ onSubmit, onResetFilters }: WrapperProps) => {
    const form = useForm({
        defaultValues: { periods: {}, category: [], participationPeriod: [1, 190] },
    });
    return (
        <FormProvider {...form}>
            <OffersFilter onSubmit={onSubmit} onResetFilters={onResetFilters} />
        </FormProvider>
    );
};

describe("OffersFilter", () => {
    it("применяет фильтр по нажатию Enter в поле фильтра, не только по кнопке", async () => {
        const onSubmit = vi.fn();
        renderWithProviders(<Wrapper onSubmit={onSubmit} onResetFilters={vi.fn()} />);

        const input = screen.getByLabelText("Не задано");
        input.focus();
        await userEvent.keyboard("{Enter}");

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("не вызывает onSubmit дважды, когда Enter нажат на самой кнопке Применить", async () => {
        const onSubmit = vi.fn();
        renderWithProviders(<Wrapper onSubmit={onSubmit} onResetFilters={vi.fn()} />);

        await userEvent.click(screen.getByText("Применить"));
        expect(onSubmit).toHaveBeenCalledTimes(1);

        await userEvent.keyboard("{Enter}");
        expect(onSubmit).toHaveBeenCalledTimes(2);
    });
});
