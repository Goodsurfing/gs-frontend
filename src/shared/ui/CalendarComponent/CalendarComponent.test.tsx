import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import CalendarComponent from "./CalendarComponent";

/**
 * Row: "явно можно подаваться... на даты в прошлом" — в форме заявки
 * (TermsApplication → DateInput → DatePickerCalendar) minDate/maxDate
 * доходили до CalendarComponent, но тот их не прокидывал дальше в
 * react-calendar (деструктурировались только value/onChange/locale/
 * className) — календарь визуально не блокировал прошлые даты, и клик
 * по ним всё равно вызывал onChange.
 */
describe("CalendarComponent — прокидывает minDate/maxDate в react-calendar", () => {
    it("дата до minDate недоступна для выбора (disabled)", () => {
        const minDate = new Date(2026, 6, 20); // 20 июля 2026

        const { container } = render(
            <CalendarComponent
                value={minDate}
                onChange={() => {}}
                minDate={minDate}
            />,
        );

        const pastDayAbbr = container.querySelector("abbr[aria-label=\"July 15, 2026\"]");
        expect(pastDayAbbr).toBeTruthy();
        const pastDayButton = pastDayAbbr?.closest("button");
        expect(pastDayButton).toBeDisabled();

        const validDayAbbr = container.querySelector("abbr[aria-label=\"July 25, 2026\"]");
        const validDayButton = validDayAbbr?.closest("button");
        expect(validDayButton).not.toBeDisabled();
    });
});
