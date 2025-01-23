import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { Host } from "@/entities/Host";
import { VolunteerApi } from "@/entities/Volunteer";
import { MediaObjectType } from "@/types/media";

export type Gender = "male" | "female" | "other";

export interface MemberProfiles {
    id: number;
    organization: string;
}
export interface Profile {
    id: string;
    email: string;
    locale: Locale;
    firstName?: string;
    lastName?: string;
    gender?: Gender;
    birthDate?: string;
    country?: string;
    city?: string;
    phone?: string;
    image?: ImageType;
    aboutMe?: string;
    vk?: string;
    facebook?: string;
    instagram?: string;
    telegram?: string;
    organizations?: Host[] | [];
    host?: string;
    volunteer?: Omit<VolunteerApi, "profile">;
    memberProfiles: MemberProfiles[];
    membershipEndDate: string;
    videoGallery?: string[]
    galleryImages: MediaObjectType[];
}

export type ProfileApi = Omit<Profile, "image" | "galleryImages"> & {
    image?: string;
    galleryImages?: string[];
};

export interface ImageType {
    id: string;
    contentUrl: string;
}

export interface ProfileSchema {
    data?: Profile;
    form?: Profile;
    readonly: boolean;
}
