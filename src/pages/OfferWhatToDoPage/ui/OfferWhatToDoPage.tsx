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
                gap={40}
                titleSize="X"
                textSize="M"
                title={t("Расскажите, чем нужно будет заниматься")}
                text={t("Подробно опишите, чем нужно будет заниматься — чем больше информации, тем лучше.")}
            />
            <OfferWhatToDoForm />
        </PageLayout>
    );
};
