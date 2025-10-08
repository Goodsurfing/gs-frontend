import React, {
    createContext, FC, ReactNode, useEffect, useMemo,
    useState, useCallback,
} from "react";
import { useAppSelector } from "@/shared/hooks/redux";
import { getUserAuthData } from "@/entities/User";
import { Profile, useGetProfileInfoQuery } from "@/entities/Profile";

interface AuthContextProps {
    token: string | null;
    mercureToken: string | null;
    myProfile: Profile | null;
    profileIsLoading: boolean;
    profileIsError: boolean;
    isAuth: boolean;
    refetchProfile: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const authData = useAppSelector(getUserAuthData);

    const [isAuth, setAuth] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const [mercureToken, setMercureToken] = useState<string | null>(null);
    const {
        data: myProfileData,
        isLoading: profileDataIsLoading, isError: profileDataIsError,
        refetch: refetchProfileData,
    } = useGetProfileInfoQuery();

    const refetchProfile = useCallback(async () => {
        await refetchProfileData();
    }, [refetchProfileData]);

    useEffect(() => {
        setAuth(!!authData);
        setToken(authData?.token ?? null);
        setMercureToken(authData?.mercureToken ?? null);
    }, [authData]);

    const myProfile = myProfileData ?? null;
    const profileIsLoading = profileDataIsLoading;
    const profileIsError = profileDataIsError;

    const value = useMemo(
        () => ({
            token,
            mercureToken,
            myProfile,
            profileIsLoading,
            profileIsError,
            isAuth,
            refetchProfile,
        }),
        [token, mercureToken, myProfile, profileIsLoading, profileIsError, isAuth, refetchProfile],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
