import { useCallback, useState } from "react";
import { NavBlockerControl, useNavBlocker } from "./useNavBlocker";

export const useConfirmNavigation = (onSubmit: any, isDirty: boolean) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [isBlocking, setIsBlocking] = useState(false);

    const handleNavBlock = useCallback(({ confirm }: NavBlockerControl) => {
        setConfirmAction(() => confirm);
        setIsBlocking(true);
        setIsModalOpen(true);
    }, []);

    const handleConfirmClick = useCallback(async () => {
        if (confirmAction) {
            await onSubmit();
            confirmAction();
            setIsBlocking(false);
            setIsModalOpen(false);
        }
    }, [confirmAction, onSubmit]);

    const handleModalClose = useCallback(() => {
        setIsBlocking(false);
        setIsModalOpen(false);
        setConfirmAction(null);
    }, []);

    useNavBlocker({
        onBlock: handleNavBlock,
        enabled: isDirty && !isBlocking,
    });

    return {
        isModalOpen,
        handleConfirmClick,
        handleModalClose,
    };
};
