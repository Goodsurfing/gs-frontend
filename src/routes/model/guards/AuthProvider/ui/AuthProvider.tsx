import React, {
    createContext, FC, ReactNode, useMemo,
} from "react";
import { useAppSelector } from "@/shared/hooks/redux";
import { getUserAuthData } from "@/entities/User";

interface AuthContextProps {
    token: string | null;
    mercureToken: string | null;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const authData = useAppSelector(getUserAuthData);

    const token = authData?.token ?? null;
    const mercureToken = authData?.mercureToken ?? null;

    const value = useMemo(() => ({ token, mercureToken }), [token, mercureToken]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
