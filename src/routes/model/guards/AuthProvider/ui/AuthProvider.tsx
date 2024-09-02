import React, {
    createContext, useState, useMemo, FC, ReactNode,
    useEffect,
} from "react";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";

interface AuthContextProps {
    token: string | null;
    setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const parseTokenFromJSON = (jsonString: string | null): string | null => {
    if (!jsonString) return null;
    try {
        const parsed = JSON.parse(jsonString);
        return parsed ?? null;
    } catch (error) {
        return null;
    }
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [token, setTokenState] = useState<string | null>(parseTokenFromJSON(
        localStorage.getItem(TOKEN_LOCALSTORAGE_KEY),
    ));

    const setToken = (newToken: string | null) => {
        setTokenState(newToken);
        if (newToken) {
            localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify({ token: newToken }));
        } else {
            localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY);
        }
    };

    useEffect(() => {
        const storedToken = parseTokenFromJSON(localStorage.getItem(TOKEN_LOCALSTORAGE_KEY));
        if (storedToken !== token) {
            setTokenState(storedToken);
        }
    }, [token]);

    const defaultProps = useMemo(() => ({ token, setToken }), [token]);

    return (
        <AuthContext.Provider value={defaultProps}>
            {children}
        </AuthContext.Provider>
    );
};
