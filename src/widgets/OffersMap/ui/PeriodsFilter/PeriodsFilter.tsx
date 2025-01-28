import React, { FC, memo, useCallback } from "react";

import { DatePeriods } from "@/features/OfferWhen/model/types/offerWhen";

import { Periods } from "../Periods/Periods";

interface PeriodsFilterProps {
    value: DatePeriods;
    onChange: (value: DatePeriods) => void;
    wrapperClassName?: string;
}

export const PeriodsFilter: FC<PeriodsFilterProps> = memo((props: PeriodsFilterProps) => {
    const { value, onChange, wrapperClassName } = props;

    const handlePeriodsChange = useCallback((periods: DatePeriods) => {
        if (value) {
            onChange(periods);
        }
    }, [value, onChange]);

    return (
        <div>
            <Periods
                wrapperClassName={wrapperClassName}
                onDateChange={handlePeriodsChange}
                value={value}
            />
        </div>
    );
}, (prevProps, nextProps) => (
    prevProps.value === nextProps.value
        && prevProps.onChange === nextProps.onChange
        && prevProps.wrapperClassName === nextProps.wrapperClassName
));
