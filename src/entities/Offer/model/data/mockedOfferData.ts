import { Offer } from "../types/offer";
import defaultImage from "@/shared/assets/images/personalCardMOCK.png";

export const mockedOffersData: Offer[] = [
    {
        id: "1",
        when: {
            durationMinDays: 26,
            durationMaxDays: 30,
            isApplicableAtTheEnd: true,
            isFullYearAcceptable: true,
            periods: [{ start: "31.01.2023", end: "8.02.2023" }],
        },
        where: {
            address: "Казань Пушкина 46",
        },
        conditions: {
            additionalFeaturesIds: ["additional", "excursions"],
            conveniencesIds: ["bath", "wi-fi"],
            volunteerContributions: 1600,
            volunteerRemuneration: 2000,
            currency: "RUB",
            additionalConditions: "some conditions",
            housingIds: "bed",
            foodIds: "full",
            paidTravelIds: "reimbursement",
        },
        whatToDo: {
            skillIds: [{ text: "cooking" }],
            dayOff: 3,
            hours: 40,
            timeType: "day",
            additionalSkills: ["additional skills"],
            externalInfo: "extra info",
        },
        whoNeeds: {
            genders: ["male"],
            languages: [{ language: "russian", level: "beginner" }, { language: "english", level: "not_matter" }],
            receptionPlace: "foreigners",
            volunteerPlaces: 3,
            additionalInfo: "additional info",
            ageMin: 18,
            ageMax: 25,
            needAllLanguages: false,
        },
        description: {
            title: "Природный парк «Вулканы Камчатки» ждет волонтеров!",
            description:
            "В летнем сезоне 2023 года природному парку «Вулканы Камчатки» требуется помощь добровольцев для выполнения различных видов деятельности на особо охраняемых природных территориях регионального значения. Ждем волонтеров на новый летний сезон! Природный парк «Вулканы Камчатки» объявляет о начале приема заявок на участие в волонтерской программе 2020 года от потенциальных кандидатов. Добровольцы смогут отправиться в природные парки «Налычево», «Быстринский» и «Ключевской». Работы, к которым будут привлекаться волонтеры, запланированы на период с июня по сентябрь. В летнем сезоне 2020 года природному парку «Вулканы Камчатки» требуется помощь добровольцев для выполнения различных видов деятельности на особо охраняемых природных территориях регионального значения. В частности, планируется задействовать волонтеров в работах, связанных с ремонтом и поддержанием в надлежащем виде объектов туристической инфраструктуры, благоустройством прилегающей территории, уборкой мусора, ведением экскурсионной деятельности и общением с посетителями ООПТ регионального значения.",
            shortDescription: "short description",
            categoryIds: ["category1", "category2"],
            galleryIds: ["img1.png"],
        },
        finishingTouches: {
            questions: "вопросы",
            questionnaireUrl: "example.com",
            onlyVerified: true,
            rulesInfo: "some rules",
            welcomeMessage: "welcome message",
            extraConditions: ["students", "adult-only", "allow-kids", "couples"],
        },
        contributors: [{ name: "Prikol Prikolovich", avatar: "" }],
        status: "open",
        state: "accepted",
    },
    {
        id: "2",
        when: {
            durationMinDays: 26,
            durationMaxDays: 30,
            isApplicableAtTheEnd: true,
            isFullYearAcceptable: true,
            periods: [{ start: "31.01.2023", end: "8.02.2023" }],
        },
        where: {
            address: "Казань ул. Баумана, 70А",
        },
        conditions: {
            additionalFeaturesIds: ["additional", "excursions"],
            conveniencesIds: ["bath", "wi-fi"],
            volunteerContributions: 1600,
            volunteerRemuneration: 2000,
            currency: "RUB",
            additionalConditions: "some conditions",
            housingIds: "bed",
            foodIds: "full",
            paidTravelIds: "reimbursement",
        },
        whatToDo: {
            skillIds: [{ text: "cooking" }],
            dayOff: 3,
            hours: 40,
            timeType: "day",
            additionalSkills: ["additional skills"],
            externalInfo: "extra info",
        },
        whoNeeds: {
            genders: ["male"],
            languages: [{ language: "russian", level: "beginner" }, { language: "english", level: "not_matter" }],
            receptionPlace: "foreigners",
            volunteerPlaces: 3,
            additionalInfo: "additional info",
            ageMax: 25,
            ageMin: 18,
            needAllLanguages: false,
        },
        description: {
            imageId: defaultImage,
            title: "Природный парк «Вулканы Камчатки» ждет волонтеров!",
            description:
            "В летнем сезоне 2023 года природному парку «Вулканы Камчатки» требуется помощь добровольцев для выполнения различных видов деятельности на особо охраняемых природных территориях регионального значения. Ждем волонтеров на новый летний сезон! Природный парк «Вулканы Камчатки» объявляет о начале приема заявок на участие в волонтерской программе 2020 года от потенциальных кандидатов. Добровольцы смогут отправиться в природные парки «Налычево», «Быстринский» и «Ключевской». Работы, к которым будут привлекаться волонтеры, запланированы на период с июня по сентябрь. В летнем сезоне 2020 года природному парку «Вулканы Камчатки» требуется помощь добровольцев для выполнения различных видов деятельности на особо охраняемых природных территориях регионального значения. В частности, планируется задействовать волонтеров в работах, связанных с ремонтом и поддержанием в надлежащем виде объектов туристической инфраструктуры, благоустройством прилегающей территории, уборкой мусора, ведением экскурсионной деятельности и общением с посетителями ООПТ регионального значения.",
            shortDescription: "short description",
            categoryIds: ["category1", "category2"],
            galleryIds: ["img1.png"],
        },
        finishingTouches: {
            questions: "some faq",
            rulesInfo: "some rules",
            welcomeMessage: "welcome message",
            extraConditions: ["students", "adult-only", "allow-kids", "couples"],
            onlyVerified: true,
            questionnaireUrl: "",
        },
        contributors: [{ name: "Prikol Prikolovich", avatar: "" }],
        status: "open",
        state: "under consideration",
    },
    {
        id: "3",
        when: {
            durationMinDays: 26,
            durationMaxDays: 30,
            isApplicableAtTheEnd: true,
            isFullYearAcceptable: true,
            applicationEndDate: "",
            periods: [{ start: "31.01.2023", end: "8.02.2023" }],
        },
        where: {
            address: "Казань ул. Чехова, 2, Вахитовский район",
        },
        conditions: {
            additionalFeaturesIds: ["additional", "excursions"],
            conveniencesIds: ["bath", "wi-fi"],
            currency: "RUB",
            volunteerContributions: 1600,
            volunteerRemuneration: 2000,
            additionalConditions: "some conditions",
            housingIds: "bed",
            foodIds: "full",
            paidTravelIds: "reimbursement",
        },
        whatToDo: {
            skillIds: [{ text: "cooking" }],
            dayOff: 3,
            hours: 40,
            timeType: "day",
            additionalSkills: ["additional skills"],
            externalInfo: "extra info",
        },
        whoNeeds: {
            genders: ["male"],
            languages: [{ language: "russian", level: "beginner" }, { language: "english", level: "not_matter" }],
            receptionPlace: "foreigners",
            volunteerPlaces: 3,
            additionalInfo: "additional info",
            ageMax: 25,
            ageMin: 18,
            needAllLanguages: false,
        },
        description: {
            title: "Природный парк «Вулканы Камчатки» ждет волонтеров!",
            description: "В летнем сезоне 2023 года природному парку «Вулканы Камчатки» требуется помощь добровольцев для выполнения различных видов деятельности на особо охраняемых природных территориях регионального значения. Ждем волонтеров на новый летний сезон! Природный парк «Вулканы Камчатки» объявляет о начале приема заявок на участие в волонтерской программе 2020 года от потенциальных кандидатов. Добровольцы смогут отправиться в природные парки «Налычево», «Быстринский» и «Ключевской». Работы, к которым будут привлекаться волонтеры, запланированы на период с июня по сентябрь. В летнем сезоне 2020 года природному парку «Вулканы Камчатки» требуется помощь добровольцев для выполнения различных видов деятельности на особо охраняемых природных территориях регионального значения. В частности, планируется задействовать волонтеров в работах, связанных с ремонтом и поддержанием в надлежащем виде объектов туристической инфраструктуры, благоустройством прилегающей территории, уборкой мусора, ведением экскурсионной деятельности и общением с посетителями ООПТ регионального значения.",
            shortDescription: "short description",
            categoryIds: ["category1", "category2"],
            galleryIds: ["img1.png"],
        },
        finishingTouches: {
            questions: "вопросы",
            questionnaireUrl: "example.com",
            onlyVerified: true,
            rulesInfo: "some rules",
            welcomeMessage: "welcome message",
            extraConditions: ["students", "adult-only", "allow-kids", "couples"],
        },
        contributors: [{ name: "Prikol Prikolovich", avatar: "" }],
        status: "open",
        state: "confirmed",
    },
];
