import { useLocale } from "@/app/providers/LocaleProvider";

import {
    getHostPersonalPageUrl,
    getMessengerPageCreateUrl,
    getOfferPersonalPageUrl,
    getVolunteerPersonalPageUrl,
} from "@/shared/config/routes/AppUrls";

export type NextRouteType = "offer" | "messenger" | "host" | "volunteer";

export const useNextRoutes = () => {
    const { locale } = useLocale();

    const getNextRoute = (type: NextRouteType, id: string) => {
        const nextRoutes: Record<NextRouteType, string> = {
            offer: getOfferPersonalPageUrl(locale, id),
            host: getHostPersonalPageUrl(locale, id),
            messenger: getMessengerPageCreateUrl(locale, id),
            volunteer: getVolunteerPersonalPageUrl(locale, id),
        };

        return nextRoutes[type];
    };

    return { getNextRoute };
};
