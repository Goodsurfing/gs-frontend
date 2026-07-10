import {
    createContext, FC, ReactNode, useContext, useMemo, useState,
} from "react";
import { FeedbackModal } from "@/shared/ui/FeedbackModal/FeedbackModal";

interface FeedbackWidgetContextProps {
    openFeedbackModal: () => void;
}

const FeedbackWidgetContext = createContext<FeedbackWidgetContextProps | undefined>(undefined);

export const FeedbackWidgetProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const value = useMemo(() => ({
        openFeedbackModal: () => setIsOpen(true),
    }), []);

    return (
        <FeedbackWidgetContext.Provider value={value}>
            {children}
            <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </FeedbackWidgetContext.Provider>
    );
};

export const useFeedbackWidget = (): FeedbackWidgetContextProps => {
    const context = useContext(FeedbackWidgetContext);
    if (!context) {
        throw new Error("useFeedbackWidget must be used within FeedbackWidgetProvider");
    }
    return context;
};
