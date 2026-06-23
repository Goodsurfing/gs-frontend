export interface MembershipFaqItem {
    title: string;
    description: string;
}

interface MembershipFaqTranslate {
    (key: string, defaultValue: string): string;
}

export const getMembershipFaq = (t: MembershipFaqTranslate): MembershipFaqItem[] => [
    {
        title: t(
            "questions.faq.why-pay.question",
            "Почему я должен платить, если я и так помогаю как волонтёр?",
        ),
        description: t(
            "questions.faq.why-pay.answer",
            "Ваш членский взнос идёт на поддержку инфраструктуры проекта: разработку сайта, создание контента, организацию мероприятий и юридическую поддержку. Так вы помогаете Гудсёрфингу расти и становиться лучше для всех участников.",
        ),
    },
    {
        title: t(
            "questions.faq.not-renew.question",
            "Что будет, если я не продлю членство?",
        ),
        description: t(
            "questions.faq.not-renew.answer",
            "Вы всегда можете оставаться частью сообщества, читать блог и участвовать в открытых мероприятиях. Однако доступ к волонтёрским проектам и закрытым материалам будет ограничен до момента продления членства.",
        ),
    },
    {
        title: t(
            "questions.faq.money.question",
            "Куда идут мои деньги?",
        ),
        description: t(
            "questions.faq.money.answer",
            "Мы — некоммерческая организация, и все средства направляются на развитие проекта. Вы можете ознакомиться с нашими отчётами и финансовой информацией в разделе «Об НКО».",
        ),
    },
];
