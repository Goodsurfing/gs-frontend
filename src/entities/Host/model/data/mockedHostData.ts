import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

import defaultImageGallery from "@/shared/assets/images/offers/1.jpg";

import {
    Host,
} from "@/entities/Host";
import { Review } from "@/entities/Review";
import { FullFormApplication } from "@/entities/Application";

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
    otherType: "",
    shortDescription: "",
    feedbacksCount: 5,
    owner: {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        email: "string",
        locale: "ru",
        favoriteCategories: [],
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
        galleryImages: [],
        videoGallery: [],
    },
    team: [
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            email: "string",
            locale: "ru",
            favoriteCategories: [],
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
            memberProfiles: [],
            membershipEndDate: "",
            galleryImages: [],
            videoGallery: [],
        },
    ],
    vacancies: [
        "https://example.com/",
    ],
    galleryImages: [],
    videoGallery: [],
};

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

export const mockedApplications: FullFormApplication[] = [
    {
        id: 1,
        status: "new",
        volunteer: {
            feedbacksCount: 5,
            profile: {
                id: "1",
                host: "",
                email: "test1@test.com",
                locale: "ru",
                favoriteCategories: [],
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
                memberProfiles: [],
                membershipEndDate: "",
                galleryImages: [],
                videoGallery: [],
            },
            additionalSkills: [],
            externalInfo: "",
            languages: [],
            skills: [],
            certificates: [],
        },
        endDate: "",
        startDate: "",
        vacancy: mockedOffersData[0],
        hasFeedbackFromOrganization: false,
        hasFeedbackFromVolunteer: false,
    },
    {
        id: 2,
        status: "new",
        volunteer: {
            feedbacksCount: 5,
            profile: {
                id: "1",
                host: "",
                email: "test1@test.com",
                locale: "ru",
                favoriteCategories: [],
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
                memberProfiles: [],
                membershipEndDate: "",
                galleryImages: [],
                videoGallery: [],
            },
            additionalSkills: [],
            externalInfo: "",
            languages: [],
            skills: [],
            certificates: [],
        },
        endDate: "",
        startDate: "",
        vacancy: mockedOffersData[0],
        hasFeedbackFromOrganization: false,
        hasFeedbackFromVolunteer: false,
    },
    {
        id: 3,
        status: "accepted",
        volunteer: {
            feedbacksCount: 5,
            profile: {
                id: "1",
                host: "",
                email: "test1@test.com",
                locale: "ru",
                favoriteCategories: [],
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
                memberProfiles: [],
                membershipEndDate: "",
                galleryImages: [],
                videoGallery: [],
            },
            additionalSkills: [],
            externalInfo: "",
            languages: [],
            skills: [],
            certificates: [],
        },
        endDate: "",
        startDate: "",
        vacancy: mockedOffersData[0],
        hasFeedbackFromOrganization: false,
        hasFeedbackFromVolunteer: false,
    },
    {
        id: 4,
        status: "accepted",
        volunteer: {
            feedbacksCount: 5,
            profile: {
                id: "1",
                host: "",
                email: "test1@test.com",
                locale: "ru",
                favoriteCategories: [],
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
                memberProfiles: [],
                membershipEndDate: "",
                galleryImages: [],
                videoGallery: [],
            },
            additionalSkills: [],
            externalInfo: "",
            languages: [],
            skills: [],
            certificates: [],
        },
        endDate: "",
        startDate: "",
        vacancy: mockedOffersData[0],
        hasFeedbackFromOrganization: false,
        hasFeedbackFromVolunteer: false,
    },
    {
        id: 5,
        status: "accepted",
        volunteer: {
            feedbacksCount: 5,
            profile: {
                id: "1",
                host: "",
                email: "test1@test.com",
                locale: "ru",
                favoriteCategories: [],
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
                memberProfiles: [],
                membershipEndDate: "",
                galleryImages: [],
                videoGallery: [],
            },
            additionalSkills: [],
            externalInfo: "",
            languages: [],
            skills: [],
            certificates: [],
        },
        endDate: "",
        startDate: "",
        vacancy: mockedOffersData[0],
        hasFeedbackFromOrganization: false,
        hasFeedbackFromVolunteer: false,
    },
];
