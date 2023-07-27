import { useTranslation } from "react-i18next";
import { OfferWhatToDoForm } from "@/features/OfferWhatToDo";
import { SideMenuData } from "@/shared/data/offer-pages";
import { Text } from "@/shared/ui/Text/Text";
import { PageLayout } from "@/widgets/PageLayout";

export const OfferWhatToDoPage = () => {
    const { t } = useTranslation("what-to-do");
    return (
        <PageLayout sidebarContent={SideMenuData}>
            <Text
                title={t("Чем вы готовы обеспечить волонтёра")}
                text={t("Волонтёр помогает вам и будет делать это лучше, если ему будет комфортно. Создавая лучшие условия вы привлекаете лучших волонтёров.")}
            />
            <OfferWhatToDoForm />
        </PageLayout>
    );
};
