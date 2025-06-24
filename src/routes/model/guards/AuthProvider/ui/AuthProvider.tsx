import React, {
    createContext, FC, ReactNode, useMemo,
} from "react";
import { useAppSelector } from "@/shared/hooks/redux";
import { getUserAuthData } from "@/entities/User";
import { Profile, useGetProfileInfoQuery } from "@/entities/Profile";

interface AuthContextProps {
    token: string | null;
    mercureToken: string | null;
    myProfile: Profile | null;
    profileIsLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const authData = useAppSelector(getUserAuthData);

    const { data: myProfileData, isLoading: profileDataIsLoading } = useGetProfileInfoQuery();

    const myProfile = myProfileData ?? null;
    const profileIsLoading = profileDataIsLoading;
    const token = authData?.token ?? null;
    const mercureToken = authData?.mercureToken ?? null;

    const value = useMemo(
        () => ({
            token, mercureToken, myProfile, profileIsLoading,
        }),
        [token, mercureToken, myProfile, profileIsLoading],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
