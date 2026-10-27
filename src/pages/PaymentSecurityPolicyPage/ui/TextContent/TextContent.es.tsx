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

export const TextContentEs: FC<TextContentProps> = (props: TextContentProps) => {
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
                    Puede realizar una donación con tarjetas bancarias de los sistemas
                    de pago Visa, MasterCard y Mir. Al pagar con tarjeta bancaria, la
                    seguridad de los pagos está garantizada por el servicio de pago
                    {" "}
                    <a className={styles.link} href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                        YooKassa
                    </a>
                    .
                </p>
                <p className={styles.description}>
                    Las donaciones se reciben a través de una conexión protegida y segura
                    mediante el protocolo TLS 1.2. El servicio
                    {" "}
                    <a className={styles.link} href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                        YooKassa
                    </a>
                    {" "}
                    cumple con los requisitos internacionales PCI DSS para garantizar el
                    tratamiento seguro de los datos de la tarjeta bancaria del pagador.
                    Sus datos confidenciales necesarios para la donación (datos de la
                    tarjeta, datos de registro, etc.) no llegan a la Fundación Benéfica;
                    su tratamiento se realiza del lado del servicio
                    {" "}
                    <a className={styles.link} href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                        YooKassa
                    </a>
                    {" "}
                    y está totalmente protegido. Nadie, incluida la Fundación Benéfica
                    (ANO «Goodsurfing», goodsurfing.org), puede obtener los datos
                    bancarios y personales del pagador.
                </p>
                <p className={styles.description}>
                    Al realizar una donación con tarjeta bancaria, el reembolso se
                    efectúa a la misma tarjeta con la que se realizó el pago.
                </p>
                <p className={styles.description}>
                    Información sobre el servicio de pago:
                    {" "}
                    <a className={styles.link} href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                        YooKassa
                    </a>
                </p>
            </div>
        </section>
    );
};
