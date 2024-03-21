import { memo, ChangeEvent } from "react";

import { MenuItem } from "@mui/material";
import { SelectComponent } from "@/shared/ui/Select/Select";
import Input from "@/shared/ui/Input/Input";
import { WorkingHours } from "../../model/types/offerWhatToDo";
import { TimeType } from "@/entities/Offer";
import { convertStringToWord } from "../../model/lib/convertDateStringToWord/convertDateStringToWord";
import styles from "./WorkingHoursField.module.scss";

interface Props {
    value: WorkingHours;
    onChange: (value: WorkingHours) => void;
}

const TimeTypeOptions: TimeType[] = ["week", "day"];

const DayOffOptions: number[] = [1, 2, 3, 4, 5];

export const WorkingHoursField = memo(({ onChange, value }: Props) => {
    const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (+e.target.value) {
            onChange({ ...value, hours: +e.target.value });
        }
    };
    const handleTimeIntervalChange = (timeType: TimeType) => {
        onChange({ ...value, timeType });
    };
    const handleDayOffChange = (newValue: string) => {
        onChange({ ...value, dayOffs: +newValue });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.workingHoursWrapper}>
                <p className={styles.workingHoursText}>Количество рабочих часов</p>
                <div className={styles.workingHours}>
                    <Input
                        inputClassName={styles.inputClassName}
                        type="number"
                        onChange={handleHoursChange}
                        value={value.hours}
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
                <p className={styles.dayOffsText}>Количество выходных дней в неделю</p>
                <SelectComponent
                    className={styles.dayOffsSelect}
                    onChange={(e) => handleDayOffChange(e.target.value as string)}
                    value={value.dayOffs}
                >
                    {DayOffOptions.map((item) => (
                        <MenuItem key={item} value={item}>{item}</MenuItem>
                    ))}
                </SelectComponent>
            </div>
        </div>
    );
});
