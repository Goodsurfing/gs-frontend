import cn from "classnames";
import React, { FC } from "react";

import styles from "./TextContent.module.scss";

interface TextContentProps {
    className?: string;
}

export const TextContent: FC<TextContentProps> = (props: TextContentProps) => {
    const { className } = props;
    return (
        <section className={cn(className, styles.wrapper)}>
            <div className={styles.content}>
                <p className={styles.description}>
                    Совершить пожертвование можно с помощью банковских карт
                    платёжных систем Visa, MasterCard, МИР. При оплате
                    банковской картой безопасность платежей гарантирует
                    процессинговый центр Best2Pay.
                </p>
                <p className={styles.description}>
                    Приём пожертвований происходит через защищённое
                    безопасное соединение, используя протокол TLS 1.2.
                    Компания Best2Pay соответствует международным
                    требованиями PCI DSS для обеспечения безопасной
                    обработки реквизитов банковской карты плательщика. Ваши
                    конфиденциальные данные, необходимые для пожертвования
                    (реквизиты карты, регистрационные данные и др.), не
                    поступают в Благотворительный фонд, их обработка
                    производится на стороне процессингового центра Best2Pay
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
