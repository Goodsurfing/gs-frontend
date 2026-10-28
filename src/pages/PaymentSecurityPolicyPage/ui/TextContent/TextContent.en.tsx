import cn from "classnames";
import React, { FC } from "react";

import visaLogo from "@/shared/assets/images/payment-security-policy/visa.png";
import mastercardLogo from "@/shared/assets/images/payment-security-policy/mastercard.png";
import mirLogo from "@/shared/assets/images/payment-security-policy/mir.jpg";

import styles from "./TextContent.module.scss";

interface TextContentProps {
    className?: string;
}

const YOOKASSA_URL = "https://yookassa.ru/";

export const TextContentEn: FC<TextContentProps> = (props: TextContentProps) => {
    const { className } = props;
    return (
        <section className={cn(className, styles.wrapper)}>
            <div className={styles.content}>
                <div className={styles.logos}>
                    <img className={styles.logo} src={visaLogo} alt="Visa" />
                    <img className={styles.logo} src={mastercardLogo} alt="MasterCard" />
                    <img className={styles.logo} src={mirLogo} alt="Mir" />
                </div>
                <p className={styles.description}>
                    A donation can be made using bank cards of the Visa, MasterCard
                    and Mir payment systems. When paying by bank card, the security
                    of payments is guaranteed by the payment service
                    {" "}
                    <a className={styles.link} href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                        YooKassa
                    </a>
                    .
                </p>
                <p className={styles.description}>
                    Donations are accepted through a protected and secure connection
                    using the TLS 1.2 protocol. The service
                    {" "}
                    <a className={styles.link} href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                        YooKassa
                    </a>
                    {" "}
                    complies with the international PCI DSS requirements for ensuring
                    secure processing of the payer’s bank card details. Your
                    confidential data required for the donation (card details,
                    registration data, etc.) is not transferred to the Charitable
                    Foundation; it is processed on the side of the service
                    {" "}
                    <a className={styles.link} href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                        YooKassa
                    </a>
                    {" "}
                    and is fully protected. No one, including the Charitable Foundation
                    (ANO “Goodsurfing”, goodsurfing.org), can obtain the payer’s bank
                    and personal data.
                </p>
                <p className={styles.description}>
                    When a donation is made by bank card, refunds are made to the same
                    card from which the payment was made.
                </p>
                <p className={styles.description}>
                    Information about the payment service:
                    {" "}
                    <a className={styles.link} href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                        YooKassa
                    </a>
                </p>
            </div>
        </section>
    );
};
