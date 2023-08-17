import { useEffect, useState } from "react";
import { useAppSelector } from "@/shared/hooks/redux";
import { profileApi } from "../model/services/profileApi/profileApi";
import { getProfileData } from "../model/selectors/profileSelectors/profileSelectors";
import { Profile } from "../model/types/profile";

export function useUser() {
    const [profile, setProfile] = useState<Profile>();
    const [getProfile, { isLoading, error }] = profileApi.useLazyGetProfileInfoQuery();

    const profileData = useAppSelector(getProfileData);

    useEffect(() => {
        if (profileData?.id) {
            setProfile(profile);
        }
        getProfile().then((res) => {
            setProfile(res.data);
        });
    }, [getProfile, profileData, profile]);
    if (error) {
        return { profile, isLoading, error: error?.error };
    }
    return { profile, isLoading, error };
}
