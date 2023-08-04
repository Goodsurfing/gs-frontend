import React from "react";
import { useNavigate } from "react-router-dom";

import { HostPagesSidebarData } from "@/shared/data/host-pages";
import HostOffersPageCard from "../HostOffersPageCard/HostOffersPageCard";

import image from "@/shared/assets/images/default-offer-image.svg";

import styles from "./HostOffersPage.module.scss";
import { PageLayout } from "@/widgets/PageLayout";
import { SidebarProvider } from "@/widgets/Sidebar";
import { useLocale } from "@/app/providers/LocaleProvider";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getOffersWelcomePageUrl } from "@/shared/config/routes/AppUrls";

const HostOffersPage = () => {
    const navigate = useNavigate();
    const { locale } = useLocale();
    return (
        <SidebarProvider initialValue={{ isOpen: true }}>
            <PageLayout sidebarContent={HostPagesSidebarData}>
                <div className={styles.wrapper}>
                    <h2 className={styles.abilities}>Мои возможности</h2>
                    <div className={styles.cards}>
                        <HostOffersPageCard
                            title="Работа в заповеднике Лен. область"
                            image={image}
                            location="Казань, Россия"
                            category="Работа с животными"
                            rating="4.3"
                            likes="10"
                            reviews="14"
                            went="22"
                            description="Если у вас есть желание работать с детьми и помогать им, найти единомышленников и завести интересные знакомст.."
                        />
                        <HostOffersPageCard
                            title="Работа в заповеднике Лен. область"
                            image={image}
                            location="Казань, Россия"
                            category="Работа с животными"
                            rating="4.3"
                            likes="10"
                            reviews="14"
                            went="22"
                            description="Если у вас есть желание работать с детьми и помогать им, найти единомышленников и завести интересные знакомст.."
                        />
                        <HostOffersPageCard
                            title="Работа в заповеднике Лен. область"
                            image={image}
                            location="Казань, Россия"
                            category="Работа с животными"
                            rating="4.3"
                            likes="10"
                            reviews="14"
                            went="22"
                            description="Если у вас есть желание работать с детьми и помогать им, найти единомышленников и завести интересные знакомст.."
                        />
                    </div>
                    <div className={styles.drafts}>
                        <h2 className={styles.draftsTitle}>Черновики</h2>
                        <div className={styles.cards}>
                            <HostOffersPageCard
                                title="Работа в заповеднике Лен. область"
                                image={image}
                                location="Казань, Россия"
                                category="Работа с животными"
                                rating="4.3"
                                likes="10"
                                reviews="14"
                                went="22"
                                description="Если у вас есть желание работать с детьми и помогать им, найти единомышленников и завести интересные знакомст.."
                            />
                        </div>
                    </div>
                    <div className={styles.btnWrapper}>
                        <ButtonLink
                            type="primary"
                            path={getOffersWelcomePageUrl(locale)}
                            className={styles.btn}
                        >
                            Добавить предложение
                        </ButtonLink>
                    </div>
                </div>
            </PageLayout>
        </SidebarProvider>
    );
};

export default HostOffersPage;
