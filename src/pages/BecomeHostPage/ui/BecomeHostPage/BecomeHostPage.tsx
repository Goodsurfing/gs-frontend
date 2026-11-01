import React from "react";
import styles from "./BecomeHostPage.module.scss";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { Header } from "../Header/Header";
import { WhoCanInvite } from "../WhoCanInvite/WhoCanInvite";
import { HowCanHelp } from "../HowCanHelp/HowCanHelp";
import { WhatReturn } from "../WhatReturn/WhatReturn";
import { ProjectBetter } from "../ProjectBetter/ProjectBetter";
import { WhoIsGoodsurfers } from "../WhoIsGoodsurfers/WhoIsGoodsurfers";
import { WhyUseIt } from "../WhyUseIt/WhyUseIt";
import { ReviewAboutHost } from "../ReviewAboutHost/ReviewAboutHost";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getBecomeHostPageUrl } from "@/shared/config/routes/AppUrls";
import { PageSeo } from "@/shared/ui/SeoHelmet";

const BecomeHostPage = () => {
    const { locale } = useLocale();

    return (
        <MainPageLayout>
            <PageSeo section="becomeHost" path={getBecomeHostPageUrl(locale)} />
            <div className={styles.wrapper}>
                <Header />
                <WhoCanInvite />
                <HowCanHelp />
                <WhatReturn />
                <ProjectBetter />
                <WhoIsGoodsurfers />
                <WhyUseIt />
                <ReviewAboutHost />
            </div>
        </MainPageLayout>
    );
};

export default BecomeHostPage;
