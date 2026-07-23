import { memo, ChangeEvent } from "react";

import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SelectComponent } from "@/shared/ui/Select/Select";
import Input from "@/shared/ui/Input/Input";
import { TimeType, WorkSettings } from "@/entities/Offer";
import { convertStringToWord } from "../../model/lib/convertDateStringToWord/convertDateStringToWord";
import styles from "./WorkingHoursField.module.scss";

interface Props {
    value: WorkSettings;
    onChange: (value: WorkSettings) => void;
}

const TimeTypeOptions: TimeType[] = ["week", "day", "month"];

const DayOffOptions: number[] = [0, 1, 2, 3, 4, 5, 6];

const MAX_HOURS_BY_TIME_TYPE: Record<TimeType, number> = {
    day: 24,
    week: 168,
    month: 744,
};

export const WorkingHoursField = memo(({ onChange, value }: Props) => {
    const { t } = useTranslation("offer");
    const maxHours = MAX_HOURS_BY_TIME_TYPE[value.timeType];
    const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputString = +e.target.value;
        if (inputString >= 0 && inputString <= maxHours) {
            onChange({ ...value, hours: +e.target.value });
        }
    };
    const handleTimeIntervalChange = (timeType: TimeType) => {
        const clampedHours = Math.min(value.hours, MAX_HOURS_BY_TIME_TYPE[timeType]);
        onChange({ ...value, timeType, hours: clampedHours });
    };
    const handleDayOffChange = (newValue: string) => {
        onChange({ ...value, dayOff: +newValue });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.workingHoursWrapper}>
                <p className={styles.workingHoursText}>{t("whatToDo.Количество рабочих часов")}</p>
                <div className={styles.workingHours}>
                    <Input
                        inputClassName={styles.inputClassName}
                        type="number"
                        min={0}
                        max={maxHours}
                        onChange={handleHoursChange}
                        value={value.hours.toString()}
                    />
                    <SelectComponent
                        className={styles.timeType}
                        onChange={(e) => handleTimeIntervalChange(e.target.value as TimeType)}
                        value={value.timeType}
                    >
                        {TimeTypeOptions.map((item) => (
                            <MenuItem key={item} value={item}>{convertStringToWord(item)}</MenuItem>
                        ))}
                    </SelectComponent>
                </div>
            </div>
            <div className={styles.dayOffs}>
                <p className={styles.dayOffsText}>{t("whatToDo.Количество выходных дней в неделю")}</p>
                <SelectComponent
                    className={styles.dayOffsSelect}
                    onChange={(e) => handleDayOffChange(e.target.value as string)}
                    value={value.dayOff}
                >
                    {DayOffOptions.map((item) => (
                        <MenuItem key={item} value={item}>{item}</MenuItem>
                    ))}
                </SelectComponent>
            </div>
        </div>
    );
});
