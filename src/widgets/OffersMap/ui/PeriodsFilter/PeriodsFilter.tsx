import React, { FC } from "react";

import { DatePeriods } from "@/features/OfferWhen/model/types/offerWhen";

import { Periods } from "../Periods/Periods";

interface PeriodsFilterProps {
    value: DatePeriods;
    onChange: (value: DatePeriods) => void;
}

export const PeriodsFilter: FC<PeriodsFilterProps> = (props) => {
    const { value, onChange } = props;

    const handlePeriodsChange = (periods: DatePeriods) => {
        if (value) {
            onChange(periods);
        }
    };

    return (
        <div>
            <Periods
                onDateChange={(periods) => handlePeriodsChange(periods)}
                value={value}
            />
        </div>
    );
};
