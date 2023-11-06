import React, {
    createContext, useState, useMemo, FC, ReactNode,
} from "react";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";

interface AuthContextProps {
    token: string | null;
    setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children:ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props: AuthProviderProps) => {
    const { children } = props;
    const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_LOCALSTORAGE_KEY));

    const defaultProps = useMemo(() => ({ token, setToken }), [token, setToken]);

    return (
        <AuthContext.Provider value={defaultProps}>
            {children}
        </AuthContext.Provider>
    );
};
