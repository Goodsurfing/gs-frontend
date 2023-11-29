import { mockedArticlesData } from "@/entities/Article/model/data/mockedArticleData";
import { mockedReview } from "@/entities/Host/model/data/mockedHostData";

import defaultImage from "@/shared/assets/images/personalCardMOCK.png";

import { Volunteer } from "../types/volunteer";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

export const mockedVolunteerData: Volunteer = {
    id: "1",
    imageUuid: defaultImage,
    firstName: "Станислав",
    lastName: "Старовойтов",
    aboutMe: "about me",
    isMember: true,
    birthDate: "23-04-1994",
    certificates: [""],
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
};
