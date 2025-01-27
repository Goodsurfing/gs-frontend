import { isLeapYear } from "date-fns";
import { DayType, MounthType } from "@/app/types/shared-kernel";

// eslint-disable-next-line max-len
export const birthDateData: Readonly<DayType[]> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] as const;

export const birthMounthData: Readonly<MounthType[]> = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const;

export const getMaxDaysInMonth = (month: number, year: number) => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Проверка на високосный год
    if (month === 1 && isLeapYear(year)) {
        return 29;
    }
    return daysInMonth[month];
};
