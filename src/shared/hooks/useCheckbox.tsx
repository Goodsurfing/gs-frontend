import { useCallback, useState } from "react";

export function useCheckbox() {
    const [isChecked, setIsChecked] = useState(false);
    const handleToggle = useCallback(() => {
        setIsChecked(!isChecked);
    }, [isChecked]);
    return { isChecked, handleToggle };
}
