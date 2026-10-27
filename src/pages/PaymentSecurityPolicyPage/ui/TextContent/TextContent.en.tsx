import cn from "classnames";
import React, { FC } from "react";

import visaLogo from "@/shared/assets/images/payment-security-policy/visa.png";
import mastercardLogo from "@/shared/assets/images/payment-security-policy/mastercard.png";
import mirLogo from "@/shared/assets/images/payment-security-policy/mir.jpg";
import best2payLogo from "@/shared/assets/images/payment-security-policy/best2pay.png";

import styles from "./TextContent.module.scss";

interface TextContentProps {
    className?: string;
}

const BEST2PAY_URL = "https://best2pay.net/";

export const TextContentEn: FC<TextContentProps> = (props: TextContentProps) => {
    const { className } = props;
    return (
        <section className={cn(className, styles.wrapper)}>
            <div className={styles.content}>
                <div className={styles.logos}>
                    <img className={styles.logo} src={visaLogo} alt="Visa" />
                    <img className={styles.logo} src={mastercardLogo} alt="MasterCard" />
                    <img className={styles.logo} src={mirLogo} alt="Mir" />
                    <img className={styles.logo} src={best2payLogo} alt="Best2Pay" />
                </div>
                <p className={styles.description}>
                    A donation can be made using bank cards of the Visa, MasterCard
                    and Mir payment systems. When paying by bank card, the security
                    of payments is guaranteed by the processing center
                    {" "}
                    <a className={styles.link} href={BEST2PAY_URL} target="_blank" rel="noreferrer">
                        Best2Pay
                    </a>
                    .
                </p>
                <p className={styles.description}>
                    Donations are accepted through a protected and secure connection
                    using the TLS 1.2 protocol. The Company
                    {" "}
                    <a className={styles.link} href={BEST2PAY_URL} target="_blank" rel="noreferrer">
                        Best2Pay
                    </a>
                    {" "}
                    complies with the international PCI DSS requirements for ensuring
                    secure processing of the payer’s bank card details. Your
                    confidential data required for the donation (card details,
                    registration data, etc.) is not transferred to the Charitable
                    Foundation; it is processed by the processing center
                    {" "}
                    <a className={styles.link} href={BEST2PAY_URL} target="_blank" rel="noreferrer">
                        Best2Pay
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
                    Information on the Company’s operation as a payment aggregator:
                    {" "}
                    <a
                        className={styles.link}
                        href="https://best2pay.net/support/raschetnyy-bank/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        https://best2pay.net/support/raschetnyy-bank/
                    </a>
                </p>
            </div>
        </section>
    );
};
