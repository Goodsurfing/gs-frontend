import React, { ReactNode, useCallback } from "react";

interface SelectableGroupProps<T> {
    data: T[];
    renderItem: (
        item: T,
        onClick: () => void,
        isSelected: boolean
    ) => ReactNode; // Pass isSelected to renderItem
    selectedItems: string[]; // Selected items are always strings
    onSelect: (item: string[]) => void; // Selected items are always strings
    getKey: (item: T) => string | number; // Key extraction from object
    multiSelect?: boolean;
    containerStyle?: string;
}

/**
 * A component for creating a selectable group.
 *
 * Usage example:
 *
 * ```tsx
 * <SelectableGroup
 *    data={preferences} // array of objects
 *    renderItem={(item, onClick, isSelected) =>
 *  <SelectCard data={item}
 *              onClick={onClick} selected={isSelected} />} // pass item and isSelected to component
 *    selectedItems={selectedPref} // selectedPref is state with type string[]
 *    onSelect={(value) => setSelectedPref(value)}
 *    getKey={(item) => item.id.toString()} // Assuming the key extraction is based on 'id'
 *    multiSelect // multiple selection = true
 *    containerStyle={styles.wrapper} // add style for container group
 * />
 * ```
 */

// eslint-disable-next-line @typescript-eslint/comma-dangle
export const SelectableGroup = <T,>({
    data,
    renderItem,
    selectedItems,
    onSelect,
    getKey,
    multiSelect,
    containerStyle,
}: SelectableGroupProps<T>) => {
    const isSelected = (item: T) => selectedItems.includes(getKey(item).toString());
    const handleSelection = useCallback(
        (item: T) => {
            const itemKey = getKey(item).toString();

            if (multiSelect) {
                const updatedSelection = selectedItems.includes(itemKey)
                    ? selectedItems.filter(
                        (selectedItem) => selectedItem !== itemKey,
                    )
                    : [...selectedItems, itemKey];
                onSelect(updatedSelection);
            } else {
                onSelect([itemKey]);
            }
        },
        [multiSelect, onSelect, getKey, selectedItems],
    );

    return (
        <div className={containerStyle}>
            {data.map((item) => renderItem(item, () => handleSelection(item), isSelected(item)))}
        </div>
    );
};
