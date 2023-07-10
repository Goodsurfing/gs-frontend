import {
    createContext, useContext, useState, useMemo, ReactNode, FC,
} from "react";

interface SidebarContextProps {
    isOpen?: boolean;
    setOpen?: (isOpen: boolean) => void;
}

interface SidebarProviderProps {
    initialValue?: { isOpen: boolean };
    children?: ReactNode;
}

const defaultContext = true;

export const SidebarContext = createContext<SidebarContextProps>({});

export const SidebarProvider: FC<SidebarProviderProps> = ({ children, initialValue }) => {
    const [isOpen, setOpen] = useState<boolean>(initialValue?.isOpen || defaultContext);

    const defaultProps = useMemo(
        () => ({
            isOpen,
            setOpen,
        }),
        [isOpen, setOpen],
    );

    return <SidebarContext.Provider value={defaultProps}>{children}</SidebarContext.Provider>;
};

export function useSidebarContext() {
    const { isOpen, setOpen } = useContext(SidebarContext);
    return { isOpen, setOpen };
}
