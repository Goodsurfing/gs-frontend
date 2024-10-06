import React, { FC } from "react";

import { DatePeriods } from "@/features/OfferWhen/model/types/offerWhen";

import { Periods } from "../Periods/Periods";

interface PeriodsFilterProps {
    value: DatePeriods;
    onChange: (value: DatePeriods) => void;
    wrapperClassName?: string;
}

export const PeriodsFilter: FC<PeriodsFilterProps> = (props) => {
    const { value, onChange, wrapperClassName } = props;

    const handlePeriodsChange = (periods: DatePeriods) => {
        if (value) {
            onChange(periods);
        }
    };

    return (
        <div>
            <Periods
                wrapperClassName={wrapperClassName}
                onDateChange={(periods) => handlePeriodsChange(periods)}
                value={value}
            />
        </div>
    );
};
