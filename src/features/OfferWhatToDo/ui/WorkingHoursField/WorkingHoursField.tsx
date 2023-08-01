import { memo, ChangeEvent } from "react";

import { MenuItem } from "@mui/material";
import Select from "@/shared/ui/Select/Select";
import styles from "./WorkingHoursField.module.scss";
import Input from "@/shared/ui/Input/Input";
import { WorkingHours } from "../../model/types/offerWhatToDo";
import { TimeType } from "@/entities/Offer";

interface Props {
    value: WorkingHours;
    onChange: (value: WorkingHours) => void;
}

const TimeTypeOptions: TimeType[] = ["week", "day"];

const DayOffOptions: number[] = [1, 2, 3, 4, 5, 6, 7];

export const WorkingHoursField = memo(({ onChange, value }: Props) => {
    const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (+e.target.value) {
            onChange({ ...value, hours: +e.target.value });
        }
    };
    const handleTimeIntervalChange = (timeType: TimeType) => {
        onChange({ ...value, timeType });
    };
    const handleDayOffChange = (dayOffs: number) => {
        onChange({ ...value, dayOffs });
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
                    <Select
                        onChange={(e) => handleTimeIntervalChange(e.target.value as TimeType)}
                        value={value.timeType}
                    >
                        {TimeTypeOptions.map((item) => (
                            <MenuItem key={item} value={item}>{item}</MenuItem>
                        ))}
                    </Select>
                </div>
            </div>
            <div className={styles.dayOffs}>
                <Select
                    onChange={(e) => handleDayOffChange(+e.target.value)}
                    value={value.dayOffs}
                >
                    {DayOffOptions.map((item) => (
                        <MenuItem key={item} value={item}>{item}</MenuItem>
                    ))}
                </Select>
            </div>
        </div>
    );
});
