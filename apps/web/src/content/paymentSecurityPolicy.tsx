import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";

const YOOKASSA_URL = "https://yookassa.ru/";

/** Логотипы платёжных систем; подписи как в старом фронте (на русском — «МИР»). */
export const PAYMENT_LOGOS: Record<Locale, { src: string; alt: string }[]> = {
    ru: [
        { src: "/web/images/payment-security-policy/visa.png", alt: "Visa" },
        { src: "/web/images/payment-security-policy/mastercard.png", alt: "MasterCard" },
        { src: "/web/images/payment-security-policy/mir.jpg", alt: "МИР" },
    ],
    en: [
        { src: "/web/images/payment-security-policy/visa.png", alt: "Visa" },
        { src: "/web/images/payment-security-policy/mastercard.png", alt: "MasterCard" },
        { src: "/web/images/payment-security-policy/mir.jpg", alt: "Mir" },
    ],
    es: [
        { src: "/web/images/payment-security-policy/visa.png", alt: "Visa" },
        { src: "/web/images/payment-security-policy/mastercard.png", alt: "MasterCard" },
        { src: "/web/images/payment-security-policy/mir.jpg", alt: "Mir" },
    ],
};

/**
 * Текст «Политики безопасности платежей» на трёх языках — перенесён из
 * старого фронта (src/pages/PaymentSecurityPolicyPage/ui/TextContent) без
 * изменений. Юридическую силу имеет русская версия.
 */
export const PAYMENT_SECURITY_TEXT: Record<Locale, ReactNode> = {
    ru: (
        <>
            <p className="leading-[1.5]">
                Совершить пожертвование можно с помощью банковских карт
                платёжных систем Visa, MasterCard, МИР. При оплате
                банковской картой безопасность платежей гарантирует
                платёжный сервис
                {" "}
                <a className="text-primary" href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                    ЮKassa
                </a>
                .
            </p>
            <p className="leading-[1.5]">
                Приём пожертвований происходит через защищённое
                безопасное соединение, используя протокол TLS 1.2. Сервис
                {" "}
                <a className="text-primary" href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                    ЮKassa
                </a>
                {" "}
                соответствует международным требованиям PCI DSS для
                обеспечения безопасной обработки реквизитов банковской карты
                плательщика. Ваши конфиденциальные данные, необходимые для
                пожертвования (реквизиты карты, регистрационные данные и др.),
                не поступают в Благотворительный фонд, их обработка
                производится на стороне сервиса
                {" "}
                <a className="text-primary" href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                    ЮKassa
                </a>
                {" "}
                и полностью защищена. Никто, в том числе
                Благотворительный фонд (АНО «Гудсёрфинг», goodsurfing.org),
                не может получить банковские и персональные данные
                плательщика.
            </p>
            <p className="leading-[1.5]">
                При совершении пожертвования банковской картой возврат
                денежных средств производится на ту же самую карту, с
                которой был произведён платёж.
            </p>
            <p className="leading-[1.5]">
                Информация о платёжном сервисе:
                {" "}
                <a className="text-primary" href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                    ЮKassa
                </a>
            </p>
    
        </>
    ),
    en: (
        <>
            <p className="leading-[1.5]">
                A donation can be made using bank cards of the Visa, MasterCard
                and Mir payment systems. When paying by bank card, the security
                of payments is guaranteed by the payment service
                {" "}
                <a className="text-primary" href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                    YooKassa
                </a>
                .
            </p>
            <p className="leading-[1.5]">
                Donations are accepted through a protected and secure connection
                using the TLS 1.2 protocol. The service
                {" "}
                <a className="text-primary" href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                    YooKassa
                </a>
                {" "}
                complies with the international PCI DSS requirements for ensuring
                secure processing of the payer’s bank card details. Your
                confidential data required for the donation (card details,
                registration data, etc.) is not transferred to the Charitable
                Foundation; it is processed on the side of the service
                {" "}
                <a className="text-primary" href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                    YooKassa
                </a>
                {" "}
                and is fully protected. No one, including the Charitable Foundation
                (ANO “Goodsurfing”, goodsurfing.org), can obtain the payer’s bank
                and personal data.
            </p>
            <p className="leading-[1.5]">
                When a donation is made by bank card, refunds are made to the same
                card from which the payment was made.
            </p>
            <p className="leading-[1.5]">
                Information about the payment service:
                {" "}
                <a className="text-primary" href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                    YooKassa
                </a>
            </p>
    
        </>
    ),
    es: (
        <>
            <p className="leading-[1.5]">
                Puede realizar una donación con tarjetas bancarias de los sistemas
                de pago Visa, MasterCard y Mir. Al pagar con tarjeta bancaria, la
                seguridad de los pagos está garantizada por el servicio de pago
                {" "}
                <a className="text-primary" href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                    YooKassa
                </a>
                .
            </p>
            <p className="leading-[1.5]">
                Las donaciones se reciben a través de una conexión protegida y segura
                mediante el protocolo TLS 1.2. El servicio
                {" "}
                <a className="text-primary" href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                    YooKassa
                </a>
                {" "}
                cumple con los requisitos internacionales PCI DSS para garantizar el
                tratamiento seguro de los datos de la tarjeta bancaria del pagador.
                Sus datos confidenciales necesarios para la donación (datos de la
                tarjeta, datos de registro, etc.) no llegan a la Fundación Benéfica;
                su tratamiento se realiza del lado del servicio
                {" "}
                <a className="text-primary" href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                    YooKassa
                </a>
                {" "}
                y está totalmente protegido. Nadie, incluida la Fundación Benéfica
                (ANO «Goodsurfing», goodsurfing.org), puede obtener los datos
                bancarios y personales del pagador.
            </p>
            <p className="leading-[1.5]">
                Al realizar una donación con tarjeta bancaria, el reembolso se
                efectúa a la misma tarjeta con la que se realizó el pago.
            </p>
            <p className="leading-[1.5]">
                Información sobre el servicio de pago:
                {" "}
                <a className="text-primary" href={YOOKASSA_URL} target="_blank" rel="noreferrer">
                    YooKassa
                </a>
            </p>
    
        </>
    ),
};
