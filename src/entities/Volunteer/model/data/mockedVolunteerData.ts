import { mockedArticlesData } from "@/entities/Article/model/data/mockedArticleData";
import { mockedReview } from "@/entities/Host/model/data/mockedHostData";

import defaultImage from "@/shared/assets/images/personalCardMOCK.png";

import { Volunteer, VolunteerApi } from "../types/volunteer";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

export const mockedVolunteerData: Volunteer = {
    id: "1",
    image: { id: "", contentUrl: defaultImage },
    firstName: "Станислав",
    lastName: "Старовойтов",
    aboutMe: "about me",
    isMember: true,
    birthDate: "23-04-1994",
    certificates: [defaultImage, defaultImage, defaultImage],
    skills: [
        { id: "cooking", icon: "", text: "Готовка" },
        { id: "cooking", icon: "", text: "Готовка" },
        { id: "cooking", icon: "", text: "Готовка" },
    ],
    languages: [
        { language: "english", level: "B2" },
        { language: "russian", level: "C2" },
    ],
    email: "example@gmail.com",
    locale: "ru",
    articles: mockedArticlesData,
    reviews: mockedReview,
    offers: mockedOffersData,
    gallery: { images: [defaultImage, defaultImage, defaultImage] },
    videoGallery: [],
    subscribers: [
        {
            id: "1",
            firstName: "Егор",
            lastName: "Воттакович",
            email: "example@gmail.com",
            locale: "ru",
            city: "Казань",
            country: "Россия",
            memberProfiles: [],
            membershipEndDate: "",
            galleryImages: [],
            videoGallery: [],
        },
        {
            id: "2",
            firstName: "Егор",
            lastName: "Воттакович",
            email: "example@gmail.com",
            locale: "ru",
            city: "Казань",
            country: "Россия",
            memberProfiles: [],
            membershipEndDate: "",
            galleryImages: [],
            videoGallery: [],
        },
        {
            id: "3",
            firstName: "Егор",
            lastName: "Воттакович",
            email: "example@gmail.com",
            locale: "ru",
            city: "Казань",
            country: "Россия",
            memberProfiles: [],
            membershipEndDate: "",
            galleryImages: [],
            videoGallery: [],
        },
    ],
    memberProfiles: [],
    membershipEndDate: "",
    galleryImages: [],
};

export const mockedVolunteerApiData: VolunteerApi[] = [
    {
        profile: {
            id: "test1",
            email: "test123@test.com",
            galleryImages: [],
            locale: "ru",
            memberProfiles: [],
            membershipEndDate: "",
        },
        additionalSkills: [],
        externalInfo: "asfasf",
        languages: [],
        skills: [],
        certificates: [],
        favoriteCategories: [],
    },
    {
        profile: {
            id: "test2",
            email: "test124@test.com",
            galleryImages: [],
            locale: "ru",
            memberProfiles: [],
            membershipEndDate: "",
        },
        additionalSkills: [],
        externalInfo: "asfasf",
        languages: [],
        skills: [],
        certificates: [],
        favoriteCategories: [],
    },
    {
        profile: {
            id: "test2",
            email: "test125@test.com",
            galleryImages: [],
            locale: "ru",
            memberProfiles: [],
            membershipEndDate: "",

        },
        additionalSkills: [],
        externalInfo: "asfasf",
        languages: [],
        skills: [],
        certificates: [],
        favoriteCategories: [],
    },
];
