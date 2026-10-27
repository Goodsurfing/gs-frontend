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

export const TextContentEs: FC<TextContentProps> = (props: TextContentProps) => {
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
                    Puede realizar donaciones con tarjetas bancarias de los sistemas
                    de pago Visa, MasterCard y Mir. Al pagar con tarjeta bancaria,
                    la seguridad de los pagos está garantizada por el centro de
                    procesamiento
                    {" "}
                    <a className={styles.link} href={BEST2PAY_URL} target="_blank" rel="noreferrer">
                        Best2Pay
                    </a>
                    .
                </p>
                <p className={styles.description}>
                    La recepción de donaciones se realiza a través de una conexión
                    segura y protegida, utilizando el protocolo TLS 1.2. La Empresa
                    {" "}
                    <a className={styles.link} href={BEST2PAY_URL} target="_blank" rel="noreferrer">
                        Best2Pay
                    </a>
                    {" "}
                    cumple con los requisitos internacionales de PCI DSS para
                    garantizar el tratamiento seguro de los datos de la tarjeta
                    bancaria del donante. Sus datos confidenciales, necesarios para
                    la donación (datos de la tarjeta, datos de registro, etc.), no
                    llegan al Fondo Benéfico; su tratamiento se realiza en el lado
                    del centro de procesamiento
                    {" "}
                    <a className={styles.link} href={BEST2PAY_URL} target="_blank" rel="noreferrer">
                        Best2Pay
                    </a>
                    {" "}
                    y está completamente protegido. Nadie, incluido el Fondo Benéfico
                    (ANO «Goodsurfing», goodsurfing.org), puede obtener los datos
                    bancarios y personales del donante.
                </p>
                <p className={styles.description}>
                    Al realizar una donación con tarjeta bancaria, la devolución de
                    los fondos se efectúa a la misma tarjeta con la que se realizó
                    el pago.
                </p>
                <p className={styles.description}>
                    Información sobre la actividad de la Empresa como agregador de
                    pagos:
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
