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
    isUserVerified: boolean;
    isAuth: boolean;
    isUserAdmin: boolean;
    refetchProfile: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const authData = useAppSelector(getUserAuthData);

    const [isAuth, setAuth] = useState<boolean>(false);
    const [isUserAdmin, setUserAdmin] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const [isUserVerified, setUserVerified] = useState<boolean>(false);
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
        setUserVerified(authData?.isVerified ?? false);
        setToken(authData?.token ?? null);
        setMercureToken(authData?.mercureToken ?? null);

        if (authData) {
            const roles = Array.isArray(authData.roles) ? authData.roles : [];
            const tempRole = roles.includes("ROLE_ADMIN");
            setUserAdmin(tempRole);
        } else {
            setUserAdmin(false);
        }
    }, [authData]);

    const myProfile = myProfileData ?? null;
    const profileIsLoading = profileDataIsLoading;
    const profileIsError = profileDataIsError;

    const value = useMemo(
        () => ({
            token,
            mercureToken,
            isUserVerified,
            myProfile,
            profileIsLoading,
            profileIsError,
            isAuth,
            isUserAdmin,
            refetchProfile,
        }),
        [token, mercureToken, myProfile, profileIsLoading,

            profileIsError, isAuth,
            isUserVerified, refetchProfile, isUserAdmin],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
