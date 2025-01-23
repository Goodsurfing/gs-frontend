import React, {
    createContext, useState, useMemo, FC, ReactNode,
    useEffect,
} from "react";
import { TOKEN_LOCALSTORAGE_KEY, MERCURE_TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";

interface AuthContextProps {
    token: string | null;
    setToken: (token: string | null) => void;
    mercureToken: string | null;
    setMercureToken: (mercureToken: string | null) => void;
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
    const [mercureToken, setMercureTokenState] = useState<string | null>(parseTokenFromJSON(
        localStorage.getItem(MERCURE_TOKEN_LOCALSTORAGE_KEY),
    ));

    const setToken = (newToken: string | null) => {
        setTokenState(newToken);
        if (newToken) {
            localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify({ token: newToken }));
        } else {
            localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY);
        }
    };

    const setMercureToken = (newToken: string | null) => {
        setMercureTokenState(newToken);
        if (newToken) {
            localStorage.setItem(
                MERCURE_TOKEN_LOCALSTORAGE_KEY,
                JSON.stringify({ token: newToken }),
            );
        } else {
            localStorage.removeItem(MERCURE_TOKEN_LOCALSTORAGE_KEY);
        }
    };

    useEffect(() => {
        const storedToken = parseTokenFromJSON(localStorage.getItem(TOKEN_LOCALSTORAGE_KEY));
        if (storedToken !== token) {
            setTokenState(storedToken);
        }
    }, [token]);

    useEffect(() => {
        const storedToken = parseTokenFromJSON(localStorage.getItem(
            MERCURE_TOKEN_LOCALSTORAGE_KEY,
        ));
        if (storedToken !== mercureToken) {
            setMercureTokenState(storedToken);
        }
    }, [mercureToken]);

    const defaultProps = useMemo(() => ({
        token,
        setToken,
        mercureToken,
        setMercureToken,
    }), [mercureToken, token]);

    return (
        <AuthContext.Provider value={defaultProps}>
            {children}
        </AuthContext.Provider>
    );
};
