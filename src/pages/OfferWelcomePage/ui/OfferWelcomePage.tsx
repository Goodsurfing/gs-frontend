import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/ui/Button/Button";
import { Variant } from "@/shared/ui/Button/Button.interface";
import { SideMenuData } from "@/shared/data/offer-pages";
import { PageLayout } from "@/widgets/PageLayout";

import styles from "./OfferWelcomePage.module.scss";

const OfferWelcome: FC = () => {
    const navigate = useNavigate();

    return (
        <PageLayout sidebarContent={SideMenuData}>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>Привет!</h1>
                <p className={styles.description}>
                    Здесь вы можете создать и добавить на сайт свое мероприятие. А
                    между тем мы будем предлагать вам полезные советы и примеры.
                </p>
                <p className={styles.hint}>
                    Теперь на сайте можно проводить мероприятия, поэтому мы рады,
                    что вас заинтересовало это и вы хотите присоединиться к
                    растущему сообществу гудсерферов. Нам не терпится взглянуть, чем
                    вы нас обрадуете.
                </p>
                <Button
                    variant={Variant.PRIMARY}
                    rounded
                    onClick={() => { return navigate("/offers-where"); }}
                    className={styles.btn}
                >
                    Начать
                </Button>
            </div>
        </PageLayout>
    );
};

export default OfferWelcome;
