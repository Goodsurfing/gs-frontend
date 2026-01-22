import { Achievement } from "@/types/achievements";
import { GetSkill, Skill } from "@/types/skills";
import { Pagination } from "@/types/api/pagination";
import { Food, House, Transfer } from "@/shared/data/conditions";
import { Gender } from "@/entities/Profile";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { Image } from "@/types/media";
import {
    ProfileAbout,
    ProfileGender, ProfileLocale, ProfileContacts, ProfileAboutMe,
    ProfileSocial, ProfileDateOfBirth,
} from "@/features/ProfileInfo";
import { ReceptionPlace } from "@/entities/Offer";
import { Language } from "@/types/languages";

export interface Admin {
    token: string,
}

export interface AdminSchema {
    authData?: Admin,
}

export interface AdminUsersFields {
    id: string;
    email?: string;
    name?: string;
    dateRegistration?: string;
    dateLogin: string;
    isConfirmed: boolean;
    isVolunteer: boolean;
    isHost: boolean;
    isActive: boolean;
    isMembership: boolean;
    dataEndMembership: string;
}

export interface AdminUserFields {
    about: ProfileAbout;
    birthDate?: ProfileDateOfBirth;
    gender?: ProfileGender;
    locale: ProfileLocale;
    contacts: ProfileContacts;
    aboutMe?: ProfileAboutMe;
    social: ProfileSocial;
    profileAvatar?: {
        id: string;
        imagePath: string;
    };
}

export interface AdminUsers {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    created: string; // time account created
    lastVisit: string;
    isVerified: boolean;
    isSkill: boolean; // is volunteer
    isOrganization: boolean;
    isActive: boolean; // is block
    isPayment: boolean;
    endPayment: string;
}

export interface AdminUser {
    firstName: string | null;
    lastName: string | null;
    image: Image | null;
    email: string;
    birthDate: string | null;
    gender: Gender | null;
    country: string | null;
    city: string | null;
    locale: Locale;
    phone: string | null;
    aboutMe: string | null;
    vk: string | null;
    facebook: string | null;
    instagram: string | null;
    telegram: string | null;
    achievements: Achievement[];
    skills: GetSkill[];
    additionalSkills: string[];
    created: string; // time account created
    lastVisit: string;
    isVerified: boolean;
    isVolunteer: boolean; // is volunteer
    isOrganization: boolean;
    isActive: boolean;
    isPayment: boolean;
    endPayment: string;
}

export type UpdateAdminUser = Omit<AdminUser, "created" | "lastVisit" | "isVerified"
| "isVolunteer" | "isOrganization" | "isActive" | "isPayment" | "endPayment" | "imagePath" | "thumbnails"
| "email" | "skills" | "image" | "achievements"> & {
    imageId: string | null;
    skillIds: number[];
    achievementIds: number[];
};

export enum AdminSort {
    IdAsc = "id:asc",
    IdDesc = "id:desc",
    NameAsc = "name:asc",
    NameDesc = "name:desc",
    EmailAsc = "email:asc",
    EmailDesc = "email:desc",
    FioAsc = "fio:asc",
    FioDesc = "fio:desc",
    FioAuthorAsc = "fio.author:asc",
    FioAuthorDesc = "fio.author:desc",
    FioVolunteerAsc = "fio.volunteer:asc",
    FioVolunteerDesc = "fio.volunteer:desc",
    RatingAsc = "rating:asc",
    RatingDesc = "rating:desc",
    EmployeeAsc = "employee:asc",
    EmployeeDesc = "employee:desc",
    CountVacanciesAsc = "countVacancies:asc",
    CountVacanciesDesc = "countVacancies:desc",
    CountApplicationsAsc = "countApplications:asc",
    CountApplicationsDesc = "countApplications:desc",
    CreatedAsc = "created:asc",
    CreatedDesc = "created:desc",
    LastVisitAsc = "lastVisit:asc",
    LastVisitDesc = "lastVisit:desc",
    IsVerifiedAsc = "isVerified:asc",
    IsVerifiedDesc = "isVerified:desc",
    IsSkillAsc = "isSkill:asc",
    IsSkillDesc = "isSkill:desc",
    IsOrganizationAsc = "isOrganization:asc",
    IsOrganizationDesc = "isOrganization:desc",
    IsActiveAsc = "isActive:asc",
    IsActiveDesc = "isActive:desc",
    IsPaymentAsc = "isPayment:asc",
    IsPaymentDesc = "isPayment:desc",
    IsEndPaymentAsc = "isEndPayment:asc",
    IsEndPaymentDesc = "isEndPayment:desc",
    CategoryNameAsc = "category.name:asc",
    CategoryNameDesc = "category.name:desc",
    UserIdAsc = "user.id:asc",
    UserIdDesc = "user.id:desc",
    OrganizationNameAsc = "organization.name:asc",
    OrganizationNameDesc = "organization.name:desc",
    TotalApplicationAsc = "totalApplication:asc",
    TotalApplicationDesc = "totalApplication:desc",
    AcceptApplicationAsc = "acceptApplication:asc",
    AcceptApplicationDesc = "acceptApplication:desc",
    CanselApplicationAsc = "canselApplication:asc",
    CanselApplicationDesc = "canselApplication:desc",
}

export interface GetAdminUserParams {
    sort: AdminSort;
    id: number; // search by id user
    email: string; // search by email of user
    firstName: string; // search by first name of user
    lastName: string; // search by last name of user
    page: number;
    limit: number;
}

export interface GetAdminUserResponse {
    data: AdminUsers[];
    pagination: Pagination;
}

export interface UpdateAdminUserRequest {
    id: string;
    body: UpdateAdminUser;
}

export interface AdminOrganization {
    id: string;
    name: string;
    isActive: boolean;
    address: string;
    type: string;
    otherType: string;
    image: Image | null;
    website: string;
    description: string;
    shortDescription: string;
    vk: string;
    facebook: string;
    instagram: string;
    telegram: string;
    countVacancies: number;
    countApplications: number;
}

export interface AdminOrganizations {
    id: string;
    name: string;
    lastName: string;
    firstName: string;
    countVacancies: number;
    countApplications: number;
    isActive: boolean;
}

export type UpdateAdminOrganization = Omit<AdminOrganization, "id" | "isActive" | "image"
| "countVacancies" | "countApplications"> & {
    imageId: string | null;
};

export interface UpdateAdminOrganizationRequest {
    id: string;
    body: UpdateAdminOrganization;
}

export interface GetAdminOrganizationParams {
    sort: AdminSort;
    name: string; // search by organization name
    firstName: string;
    lastName: string;
    page: number;
    limit: number;
}

export interface GetAdminOrganizationResponse {
    data: AdminOrganizations[];
    pagination: Pagination;
}

export interface AdminOrganizationsFields {
    id: string;
    name?: string;
    owner: string;
    countMembers: number;
    countVacancies: number;
    countApplications: number;
    isActive: boolean;
}

export interface CreateAdminSkillRequest {
    name: string;
    image: File;
}

export interface EditAdminSkillRequest {
    skillId: number;
    body: Omit<CreateAdminSkillRequest, "image"> & {
        image: File | string;
    };
}

export interface GetAdminSkillsParams {
    sort: AdminSort;
    id: number; // search by id skill
    name: string; // search by name of skill
    page: number;
    limit: number;
}

export interface GetAdminSkillsResponse {
    data: Skill[];
    pagination: Pagination
}

export interface CreateAdminAchievementsRequest {
    name: string;
    image: File;
}

export interface EditAdminAchievementsRequest {
    achievementId: number;
    body: Omit<CreateAdminAchievementsRequest, "image"> & {
        image: File | string;
    };
}

export interface GetAdminAchievementsParams {
    sort: AdminSort;
    id: number; // search by id achievement
    name: string; // search by name of achievement
    page: number;
    limit: number;
}

export interface GetAdminAchievementsResponse {
    data: Achievement[];
    pagination: Pagination
}

export interface CreateAdminTransferRequest {
    name: string;
    image: File;
}

export interface EditAdminTransferRequest {
    transferId: number;
    body: Omit<CreateAdminTransferRequest, "image"> & {
        image: File | string;
    };
}

export interface GetAdminTransfersParams {
    page: number;
    limit: number;
}

export interface GetAdminTransfersResponse {
    data: Transfer[];
    pagination: Pagination
}

export interface CreateAdminHouseRequest {
    name: string;
    image: File;
}

export interface EditAdminHouseRequest {
    houseId: number;
    body: Omit<CreateAdminHouseRequest, "image"> & {
        image: File | string;
    };
}

export interface GetAdminHouseParams {
    page: number;
    limit: number;
}

export interface GetAdminHouseResponse {
    data: House[];
    pagination: Pagination
}

export interface CreateAdminFoodRequest {
    name: string;
    image: File;
}

export interface EditAdminFoodRequest {
    foodId: number;
    body: Omit<CreateAdminFoodRequest, "image"> & {
        image: File | string;
    };
}

export interface GetAdminFoodParams {
    page: number;
    limit: number;
}

export interface GetAdminFoodResponse {
    data: Food[];
    pagination: Pagination
}

export interface SearchUsersParams {
    limit: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

export interface SearchUsersResponse {
    id: string;
    firstName: string;
    lastName: string;
}

export interface EditReviewVacancy {
    reviewId: string;
    body: {
        rating: number;
        description: string;
    }
}

export type AdminReviewVacancySort = "id:asc" | "id:desc" | "fio.author:asc" | "fio.author:desc" | "vacancy.name:asc" |
"vacancy.name:desc" | "rating:asc" | "rating:desc" | "created:asc" | "created:desc";

export interface GetAdminReviewVacancyListParams {
    sort?: AdminReviewVacancySort;
    authorLastName?: string;
    authorFirstName?: string;
    vacancyName?: string;
    page: number;
    limit: number;
}

export interface AdminReviewVacancy {
    id: string;
    authorId: string;
    authorFirstName: string | null;
    authorLastName: string | null;
    vacancyName: string | null;
    rating: number;
    description: string;
    created: string;

}

export interface GetAdminReviewVacancyListResponse {
    data: AdminReviewVacancy[];
    pagination: Pagination
}

export interface EditAdminReviewVolunteerRequest {
    body: {
        rating: number;
        description: string;
    }
    reviewId: string;
}

export type AdminReviewVolunteerSort = "id:asc" | "id:desc" | "fio.author:asc" | "fio.author:desc" | "rating:asc" | "rating:desc" |
"created:asc" | "created:desc";

export interface GetAdminReviewVolunteerListParams {
    sort?: AdminReviewVolunteerSort;
    authorLastName?: string;
    authorFirstName?: string;
    volunteerLastName?: string;
    volunteerFirstName?: string;
    page: number;
    limit: number;
}

export interface AdminReviewVolunteer {
    id: string;
    authorFirstName: string | null;
    authorLastName: string | null;
    volunteerFirstName: string | null;
    volunteerLastName: string | null;
    rating: number;
    description: string;
    created: string;
}

export interface GetAdminReviewVolunteerListResponse {
    data: AdminReviewVolunteer[];
    pagination: Pagination
}

export interface GetAdminOffersParams {
    sort?: AdminSort;
    userId?: string;
    organizationName?: string;
    vacancyName?: string;
    page: number;
    limit: number;
}

export interface GetAdminOffers {
    id: number;
    categoryName: string;
    user: {
        id: string;
        firstName: string
        lastName: string;
    },
    organizationName: string;
    name: string;
    isActive: boolean;
    countTotalApplication: number;
    countAcceptApplication: number;
    countCanselApplication: number;
}

export interface GetAdminOffersRequest {
    data: GetAdminOffers[];
    pagination: Pagination;
}

export interface AdminVacancyWhere {
    id: number;
    address: string;
    latitude: number;
    longitude: number;
}

export interface UpdateAdminVacancyWhereRequest {
    offerId: string;
    body: Omit<AdminVacancyWhere, "id">;
}

export interface AdminVacancyWhen {
    id: number,
    applicationEndDate: string,
    durationMaxDays: number,
    durationMinDays: number,
    isApplicableAtTheEnd: boolean,
    isFullYearAcceptable: boolean,
    periods: {
        id: number;
        start: string;
        end: string;
    }[]
}

export interface UpdateAdminVacancyWhenRequest {
    offerId: string;
    body: Omit<AdminVacancyWhen, "id">;
}

export interface AdminVacancyWhoNeeds {
    id: number;
    additionalInfo: string;
    ageMax: number;
    ageMin: number;
    gender: Gender[];
    needAllLanguages: boolean;
    receptionPlace: ReceptionPlace;
    languages: Language[];
}

export interface UpdateAdminVacancyWhoNeedsRequest {
    offerId: string;
    body: Omit<AdminVacancyWhoNeeds, "id">;
}
