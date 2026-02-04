import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { Achievement, AchievementWithImage } from "@/types/achievements";
import { Language } from "@/types/languages";
import { Image } from "@/types/media";
import { GetSkill } from "@/types/skills";

export type Gender = "male" | "female" | "other";

export interface MemberProfiles {
    id: number;
    organization: string;
}
export interface Profile {
    id: string;
    email: string;
    locale: Locale;
    firstName: string | null;
    lastName: string | null;
    gender: Gender | null;
    birthDate: string | null;
    country: string | null;
    city: string | null;
    phone: string | null;
    image: Image | null;
    aboutMe: string | null;
    vk: string | null;
    facebook: string | null;
    instagram: string | null;
    telegram: string | null;
    hostId: string | null;
    volunteer: {
        externalInfo: string | null;
        skills: GetSkill[];
        achievements: Achievement[];
        additionalSkills: string[];
        languages: Language[];
        certificates: Image[];
        averageRating: number;
        feedbacksCount: number;
    } | null;
    videoGallery: string[];
    galleryImages: Image[];
    favoriteCategories: number[];
    isActive: boolean;
    isVerified: boolean;
}

export type ProfileById = Omit<Profile, "volunteer" | "email" | "isVerified" | "favoriteCategories"> & {
    volunteer: {
        externalInfo: string | null;
        skills: GetSkill[];
        achievements: AchievementWithImage[];
        additionalSkills: string[];
        languages: Language[];
        certificates: string[];
        participatedVacancyIds: string[];
        averageRating: number;
        reviewCount: number;
    } | null;
};

export type UpdateProfile = Omit<Profile, "id" | "image" | "galleryImages" | "videoGallery"
| "volunteer" | "hostId" | "favoriteCategories" | "email" | "isActive" | "isVerified"> & {
    imageId: string | null;
};

export interface UpdateProfileVideoGallery {
    videoGallery: string[];
}

export interface UpdateProfileImageGallery {
    galleryImageIds: string[];
}

export interface UpdateProfileCertificates {
    certificateIds: string[];
}

export interface UpdateProfilePreferences {
    favoriteCategoryIds: number[];
}

export interface ImageType {
    id: string;
    contentUrl: string;
    isImage: boolean;
    originalHeight: number;
    originalWidth: number;
    thumbnails?: {
        large: string;
        medium: string;
        small: string;
    }
}

export interface ProfileSchema {
    data?: Profile;
    form?: Profile;
    readonly: boolean;
}
