import { Gallery } from "@/modules/Gallery/model/types/gallery";

import { mockedArticlesData } from "@/entities/Article/model/data/mockedArticleData";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";
import { fakeUserData } from "@/entities/User/model/data/mockedUserData";

import defaultImageGallery from "@/shared/assets/images/offers/1.jpg";

import {
    Application,
    FullHost, Host, VideoGallery,
} from "@/entities/Host";
import { Review } from "@/entities/Review";

export const mockedHostData: Host = {
    id: "1",
    name: "КГБУ «Природный парк «Вулканы Камчатки»",
    description:
        "Природный парк «Вулканы Камчатки» — особо охраняемая природная территория на Камчатке, самая большая по размеру в Камчатском крае (2,475 млн га",
    address: "Камчатка, Россия",
    type: "ООПТ",
    facebook: "",
    instagram: "",
    telegram: "",
    vk: "",
    website: "",
    owner: {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        email: "string",
        locale: "string",
        firstName: "string",
        lastName: "string",
        birthDate: "2024-07-01T18:11:04.893Z",
        image: {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            contentUrl: "string",
        },
        gender: "male",
        country: "string",
        city: "string",
        phone: "string",
        aboutMe: "string",
        vk: "string",
        facebook: "string",
        instagram: "string",
        telegram: "string",
    },
    team: [
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            email: "string",
            locale: "string",
            firstName: "string",
            lastName: "string",
            birthDate: "2024-07-01T18:23:44.318Z",
            image: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                contentUrl: "string",
            },
            gender: "male",
            country: "string",
            city: "string",
            phone: "string",
            aboutMe: "string",
            vk: "string",
            facebook: "string",
            instagram: "string",
            telegram: "string",
        },
    ],
    vacancies: [
        "https://example.com/",
    ],
};

const mockedGallery: Gallery = {
    images: [defaultImageGallery, defaultImageGallery, defaultImageGallery],
};

const mockedVideoGallery: VideoGallery = [
    { id: "1", url: "https://www.youtube.com/watch?v=NcnTDLCX9bM" },
    { id: "2", url: "https://www.youtube.com/watch?v=NcnTDLCX9bM" },
    { id: "3", url: "https://www.youtube.com/watch?v=NcnTDLCX9bM" },
];

export const mockedReview: Review[] = [
    {
        reviewText:
            "Кемпхилл стал для меня местом, куда я всегда могу вернуться. Ведь меня там любят и всегда мне рады. Под его крышей собираются замечательные люди с огромными сердцами. Только там я наконец-то смогла научиться принимать людей такими, какие они есть, без желания их исправить, а просто-напросто полюбить. Для меня это был совершенно уникальный опыт : совместная работа, приёмы пищи за одним бооольшим столом (передайте, пожалуйста, масло!)))), совместная подготовка к мероприятиям, таким как Библейский и музыкальный вечер, поездка в парк аттракционов или репетиция театральной постановки. Кемпхилл сделал меня частью своей семьи и по-настоящему нужным в ней элементом.",
        name: "Семён Володарский",
        date: "12 мая 2017",
        rating: 4,
        avatar: defaultImageGallery,
    },
    {
        reviewText:
            "Кемпхилл стал для меня местом, куда я всегда могу вернуться. Ведь меня там любят и всегда мне рады. Под его крышей собираются замечательные люди с огромными сердцами. Только там я наконец-то смогла научиться принимать людей такими, какие они есть, без желания их исправить, а просто-напросто полюбить. Для меня это был совершенно уникальный опыт : совместная работа, приёмы пищи за одним бооольшим столом (передайте, пожалуйста, масло!)))), совместная подготовка к мероприятиям, таким как Библейский и музыкальный вечер, поездка в парк аттракционов или репетиция театральной постановки. Кемпхилл сделал меня частью своей семьи и по-настоящему нужным в ней элементом.",
        name: "Семён Володарский",
        date: "12 мая 2017",
        rating: 4,
        avatar: defaultImageGallery,
    },
    {
        reviewText:
            "Кемпхилл стал для меня местом, куда я всегда могу вернуться. Ведь меня там любят и всегда мне рады. Под его крышей собираются замечательные люди с огромными сердцами. Только там я наконец-то смогла научиться принимать людей такими, какие они есть, без желания их исправить, а просто-напросто полюбить. Для меня это был совершенно уникальный опыт : совместная работа, приёмы пищи за одним бооольшим столом (передайте, пожалуйста, масло!)))), совместная подготовка к мероприятиям, таким как Библейский и музыкальный вечер, поездка в парк аттракционов или репетиция театральной постановки. Кемпхилл сделал меня частью своей семьи и по-настоящему нужным в ней элементом.",
        name: "Семён Володарский",
        date: "12 мая 2017",
        rating: 4,
        avatar: defaultImageGallery,
    },
];

export const mockedFullHostData: FullHost = {
    host: mockedHostData,
    team: fakeUserData,
    articles: mockedArticlesData,
    offers: mockedOffersData,
    gallery: mockedGallery,
    videoGallery: mockedVideoGallery,
    reviews: mockedReview,
};

export const mockedApplications: Application[] = [
    {
        id: 1,
        status: "new",
        volunteer: {
            profile: {
                id: "1",
                host: "",
                email: "test1@test.com",
                locale: "ru",
                aboutMe: "",
                birthDate: "",
                city: "",
                country: "Россия",
                facebook: "",
                firstName: "Георгий",
                lastName: "Старовойтов",
                gender: "male",
                image: {
                    id: "",
                    contentUrl: "",
                },
                instagram: "",
                organizations: [],
                phone: "",
                telegram: "",
                vk: "",
            },
            additionalSkills: [],
            externalInfo: "",
            languages: [],
            skills: [],
        },
        endDate: "",
        startDate: "",
        vacancy: mockedOffersData[0],
    },
    {
        id: 2,
        status: "new",
        volunteer: {
            profile: {
                id: "1",
                host: "",
                email: "test1@test.com",
                locale: "ru",
                aboutMe: "",
                birthDate: "",
                city: "",
                country: "Россия",
                facebook: "",
                firstName: "Георгий",
                lastName: "Старовойтов",
                gender: "male",
                image: {
                    id: "",
                    contentUrl: "",
                },
                instagram: "",
                organizations: [],
                phone: "",
                telegram: "",
                vk: "",
            },
            additionalSkills: [],
            externalInfo: "",
            languages: [],
            skills: [],
        },
        endDate: "",
        startDate: "",
        vacancy: mockedOffersData[0],
    },
    {
        id: 3,
        status: "accepted",
        volunteer: {
            profile: {
                id: "1",
                host: "",
                email: "test1@test.com",
                locale: "ru",
                aboutMe: "",
                birthDate: "",
                city: "",
                country: "Россия",
                facebook: "",
                firstName: "Георгий",
                lastName: "Старовойтов",
                gender: "male",
                image: {
                    id: "",
                    contentUrl: "",
                },
                instagram: "",
                organizations: [],
                phone: "",
                telegram: "",
                vk: "",
            },
            additionalSkills: [],
            externalInfo: "",
            languages: [],
            skills: [],
        },
        endDate: "",
        startDate: "",
        vacancy: mockedOffersData[0],
    },
    {
        id: 4,
        status: "accepted",
        volunteer: {
            profile: {
                id: "1",
                host: "",
                email: "test1@test.com",
                locale: "ru",
                aboutMe: "",
                birthDate: "",
                city: "",
                country: "Россия",
                facebook: "",
                firstName: "Георгий",
                lastName: "Старовойтов",
                gender: "male",
                image: {
                    id: "",
                    contentUrl: "",
                },
                instagram: "",
                organizations: [],
                phone: "",
                telegram: "",
                vk: "",
            },
            additionalSkills: [],
            externalInfo: "",
            languages: [],
            skills: [],
        },
        endDate: "",
        startDate: "",
        vacancy: mockedOffersData[0],
    },
    {
        id: 5,
        status: "accepted",
        volunteer: {
            profile: {
                id: "1",
                host: "",
                email: "test1@test.com",
                locale: "ru",
                aboutMe: "",
                birthDate: "",
                city: "",
                country: "Россия",
                facebook: "",
                firstName: "Георгий",
                lastName: "Старовойтов",
                gender: "male",
                image: {
                    id: "",
                    contentUrl: "",
                },
                instagram: "",
                organizations: [],
                phone: "",
                telegram: "",
                vk: "",
            },
            additionalSkills: [],
            externalInfo: "",
            languages: [],
            skills: [],
        },
        endDate: "",
        startDate: "",
        vacancy: mockedOffersData[0],
    },
];
