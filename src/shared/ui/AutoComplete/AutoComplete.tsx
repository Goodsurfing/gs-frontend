/* eslint-disable @typescript-eslint/comma-spacing */
import React, { useCallback, useId } from "react";

import { Autocomplete, SxProps, TextField } from "@mui/material";

interface AutoCompleteProps<T> {
    inputSx?: SxProps;
    className?: string;
    inputValue?: string;
    options: T[];
    value?: T;
    onChange?: (value: T | null) => void;
    onInputChange?: (value: string) => void;
    noOptionsText?: string;
    labelText?: string;
}

// eslint-disable-next-line @typescript-eslint/comma-dangle
const AutoComplete = <T,>({
    className,
    options,
    inputValue,
    onInputChange,
    noOptionsText,
    onChange,
    inputSx,
    labelText,
    value,
}: AutoCompleteProps<T>) => {
    const id = useId();
    const onValueChange = useCallback((newValue: T | null) => {
        onChange?.(newValue);
    }, [onChange]);
    return (
        <Autocomplete
            id={id}
            className={className}
            filterOptions={(x) => x}
            value={value}
            onChange={(_, newValue) => onValueChange(newValue)}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => onInputChange?.(newInputValue)}
            options={options}
            noOptionsText={noOptionsText}
            renderInput={(params) => <TextField label={labelText} {...params} sx={inputSx} />}
        />
    );
};

export default AutoComplete;
