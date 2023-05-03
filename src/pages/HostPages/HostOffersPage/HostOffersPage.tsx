import Button from "@/UI/Button/Button";
import { Variant } from "@/UI/Button/Button.interface";
import React from "react";
import { useNavigate } from "react-router-dom";

import image from "@/assets/images/default-offer-image.svg";

import styles from "./HostOffersPage.module.scss";
import HostOffersPageCard from "./HostOffersPageCard/HostOffersPageCard";

const HostOffersPage = () => {
    const navigate = useNavigate();
    return (
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

            <div className={styles.btn}>
                <Button
                    variant={Variant.PRIMARY}
                    rounded
                    onClick={() => {
                        return navigate("/offers-where");
                    }}
                >
                    Добавить предложение
                </Button>
            </div>
        </div>
    );
};

export default HostOffersPage;
