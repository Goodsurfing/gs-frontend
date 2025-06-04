import React, {
    createContext,
    useContext,
    useCallback,
    useRef,
    useMemo,
    ReactNode,
    FC,
} from "react";

interface MessengerContextType {
    onReadMessage: () => void;
    registerMessageUpdateCallback: (callback: () => void) => void;
}

const MessengerContext = createContext<MessengerContextType | undefined>(undefined);

export const useMessenger = () => {
    const context = useContext(MessengerContext);
    if (!context) {
        throw new Error("useChatTrigger должен использоваться внутри ChatTriggerProvider");
    }
    return context;
};

interface MessengerProviderProps {
    children: ReactNode;
}

export const MessengerProvider: FC<MessengerProviderProps> = ({ children }) => {
    const updateCallbacksRef = useRef<Set<() => void>>(new Set());

    const registerMessageUpdateCallback = useCallback((callback: () => void) => {
        updateCallbacksRef.current.add(callback);
        return () => updateCallbacksRef.current.delete(callback);
    }, []);

    const onReadMessage = useCallback(() => {
        updateCallbacksRef.current.forEach((cb) => cb());
    }, []);

    const contextValue = useMemo(
        () => ({
            onReadMessage,
            registerMessageUpdateCallback,
        }),
        [onReadMessage, registerMessageUpdateCallback],
    );

    return (
        <MessengerContext.Provider value={contextValue}>
            {children}
        </MessengerContext.Provider>
    );
};
