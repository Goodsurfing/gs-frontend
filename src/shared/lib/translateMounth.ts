import { MounthType } from "@/app/types/shared-kernel";

export const translateMounth = (mounth: MounthType) => {
    switch (mounth) {
        case "December":
            return "Декабрь";
        case "January":
            return "Январь";
        case "February":
            return "Феварль";
        case "March":
            return "Март";
        case "April":
            return "Апрель";
        case "May":
            return "Май";
        case "June":
            return "Июнь";
        case "July":
            return "Июль";
        case "August":
            return "Август";
        case "September":
            return "Сентябрь";
        case "October":
            return "Октябрь";
        case "November":
            return "Ноябрь";
        default: return null;
    }
};
