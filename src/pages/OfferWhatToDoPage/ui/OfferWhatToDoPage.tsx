import { useLocale } from "@/app/providers/LocaleProvider";
import { OfferWhatToDoForm } from "@/features/OfferWhatToDo";
import { SideMenuData } from "@/shared/data/offer-pages";
import { PageLayout } from "@/widgets/PageLayout";

export const OfferWhatToDoPage = () => {
    const { locale } = useLocale();
    return (
        <PageLayout sidebarContent={SideMenuData}>
            <OfferWhatToDoForm />
        </PageLayout>
    );
};
