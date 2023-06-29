/* eslint-disable @typescript-eslint/comma-spacing */
import React, { useCallback, useId } from "react";

import { Autocomplete, SxProps, TextField } from "@mui/material";

interface AutoCompleteProps<T> {
    inputSx?: SxProps;
    className?: string;
    inputValue?: string;
    options: readonly T[];
    getOptionLabel: (arg: T) => string;
    value?: T | null;
    onChange?: (value: T | null) => void;
    onInputChange?: (value: string) => void;
    noOptionsText?: string;
    labelText?: string;
    autocomplete?: boolean;
    renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: T) => React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/comma-dangle
const AutoComplete = <T,>({
    className,
    options,
    inputValue,
    onInputChange,
    noOptionsText,
    getOptionLabel,
    onChange,
    inputSx,
    labelText,
    value,
    renderOption,
    autocomplete = true,
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
            getOptionLabel={getOptionLabel}
            autoComplete={autocomplete}
            noOptionsText={noOptionsText}
            renderInput={(params) => <TextField label={labelText} {...params} sx={inputSx} />}
            renderOption={renderOption}
            includeInputInList
            filterSelectedOptions
        />
    );
};

export default AutoComplete;
