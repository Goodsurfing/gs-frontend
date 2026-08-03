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

export const TextContent: FC<TextContentProps> = (props: TextContentProps) => {
    const { className } = props;
    return (
        <section className={cn(className, styles.wrapper)}>
            <div className={styles.content}>
                <div className={styles.logos}>
                    <img className={styles.logo} src={visaLogo} alt="Visa" />
                    <img className={styles.logo} src={mastercardLogo} alt="MasterCard" />
                    <img className={styles.logo} src={mirLogo} alt="МИР" />
                    <img className={styles.logo} src={best2payLogo} alt="Best2Pay" />
                </div>
                <p className={styles.description}>
                    Совершить пожертвование можно с помощью банковских карт
                    платёжных систем Visa, MasterCard, МИР. При оплате
                    банковской картой безопасность платежей гарантирует
                    процессинговый центр
                    {" "}
                    <a className={styles.link} href={BEST2PAY_URL} target="_blank" rel="noreferrer">
                        Best2Pay
                    </a>
                    .
                </p>
                <p className={styles.description}>
                    Приём пожертвований происходит через защищённое
                    безопасное соединение, используя протокол TLS 1.2.
                    Компания
                    {" "}
                    <a className={styles.link} href={BEST2PAY_URL} target="_blank" rel="noreferrer">
                        Best2Pay
                    </a>
                    {" "}
                    соответствует международным
                    требованиями PCI DSS для обеспечения безопасной
                    обработки реквизитов банковской карты плательщика. Ваши
                    конфиденциальные данные, необходимые для пожертвования
                    (реквизиты карты, регистрационные данные и др.), не
                    поступают в Благотворительный фонд, их обработка
                    производится на стороне процессингового центра
                    {" "}
                    <a className={styles.link} href={BEST2PAY_URL} target="_blank" rel="noreferrer">
                        Best2Pay
                    </a>
                    {" "}
                    и полностью защищена. Никто, в том числе
                    Благотворительный фонд (АНО «Гудсёрфинг», goodsurfing.org),
                    не может получить банковские и персональные данные
                    плательщика.
                </p>
                <p className={styles.description}>
                    При совершении пожертвования банковской картой возврат
                    денежных средств производится на ту же самую карту, с
                    которой был произведён платёж.
                </p>
                <p className={styles.description}>
                    Информация о работе Компании в качестве платежного
                    агрегатора:
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
