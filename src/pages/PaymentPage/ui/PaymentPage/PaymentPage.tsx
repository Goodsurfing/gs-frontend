import React, {
    FormEvent,
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import Button from "@/shared/ui/Button/Button";
import Input from "@/shared/ui/Input/Input";
import CustomLink from "@/shared/ui/Link/Link";

import { useLocale } from "@/app/providers/LocaleProvider";
import {
    getPrivacyPolicyPageUrl,
    getRulesPageUrl,
} from "@/shared/config/routes/AppUrls";

import styles from "./PaymentPage.module.scss";

const PRESET_AMOUNTS = [300, 1500, 5000];

interface FormErrors {
    amount?: string;
    email?: string;
    fullName?: string;
    offer?: string;
    privacy?: string;
}

const PaymentPage: React.FC = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();

    const [selectedAmount, setSelectedAmount] = useState<number | null>(1500);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [isOfferAccepted, setOfferAccepted] = useState(false);
    const [isPrivacyAccepted, setPrivacyAccepted] = useState(false);

    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const amount = useMemo(() => {
        if (selectedAmount !== null) {
            return selectedAmount;
        }

        const numericValue = Number(customAmount);
        return Number.isFinite(numericValue) ? numericValue : 0;
    }, [selectedAmount, customAmount]);

    const validate = () => {
        const nextErrors: FormErrors = {};

        if (!Number.isFinite(amount) || amount <= 0) {
            nextErrors.amount = "Укажите корректную сумму пожертвования";
        }

        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            nextErrors.email = "Укажите корректный email";
        }

        if (!fullName.trim() || fullName.trim().length < 3) {
            nextErrors.fullName = "Укажите имя и фамилию";
        }

        if (!isOfferAccepted) {
            nextErrors.offer = "Нужно согласиться с офертой";
        }

        if (!isPrivacyAccepted) {
            nextErrors.privacy = "Нужно согласиться на обработку персональных данных";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage(null);

        if (!validate()) {
            return;
        }

        setSuccessMessage("Форма готова. Интеграция оплаты подключается следующим шагом.");
    };

    return (
        <MainPageLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>Пожертвование</h1>
                <p className={styles.subtitle}>
                    Поддержите развитие Гудсёрфинга и выездного волонтёрства
                </p>

                <form className={styles.formCard} onSubmit={handleSubmit}>
                    <div className={styles.grid}>
                        <section>
                            <h3 className={styles.sectionTitle}>Размер пожертвования</h3>
                            <div className={styles.amountButtons}>
                                {PRESET_AMOUNTS.map((presetAmount) => (
                                    <button
                                        key={presetAmount}
                                        type="button"
                                        className={
                                            `${styles.amountButton} ${selectedAmount === presetAmount
                                                ? styles.amountButtonActive
                                                : ""}`
                                        }
                                        onClick={() => {
                                            setSelectedAmount(presetAmount);
                                            setCustomAmount("");
                                            setErrors((prev) => ({
                                                ...prev,
                                                amount: undefined,
                                            }));
                                        }}
                                    >
                                        {presetAmount}
                                        {" "}
                                        ₽
                                    </button>
                                ))}
                            </div>

                            <div className={styles.customAmount}>
                                <Input
                                    id="custom-amount"
                                    type="number"
                                    min={1}
                                    label="Другая сумма, ₽"
                                    value={customAmount}
                                    onChange={(e) => {
                                        setSelectedAmount(null);
                                        setCustomAmount(e.target.value);
                                        setErrors((prev) => ({
                                            ...prev,
                                            amount: undefined,
                                        }));
                                    }}
                                />
                            </div>

                            {errors.amount && (
                                <p className={styles.fieldError}>{errors.amount}</p>
                            )}
                        </section>

                        <section>
                            <h3 className={styles.sectionTitle}>Ваши данные</h3>
                            <div className={styles.fields}>
                                <Input
                                    id="email"
                                    type="email"
                                    label="Ваш email *"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErrors((prev) => ({
                                            ...prev,
                                            email: undefined,
                                        }));
                                    }}
                                    isError={!!errors.email}
                                />

                                <Input
                                    id="full-name"
                                    type="text"
                                    label="Имя и Фамилия *"
                                    value={fullName}
                                    onChange={(e) => {
                                        setFullName(e.target.value);
                                        setErrors((prev) => ({
                                            ...prev,
                                            fullName: undefined,
                                        }));
                                    }}
                                    isError={!!errors.fullName}
                                />

                                {errors.email && (
                                    <p className={styles.fieldError}>{errors.email}</p>
                                )}
                                {errors.fullName && (
                                    <p className={styles.fieldError}>{errors.fullName}</p>
                                )}
                            </div>

                            <div className={styles.checkboxes}>
                                <label htmlFor="offer-check" className={styles.checkboxRow}>
                                    <input
                                        id="offer-check"
                                        type="checkbox"
                                        checked={isOfferAccepted}
                                        onChange={(e) => {
                                            setOfferAccepted(e.target.checked);
                                            setErrors((prev) => ({
                                                ...prev,
                                                offer: undefined,
                                            }));
                                        }}
                                    />
                                    <span>
                                        Соглашаюсь с
                                        {" "}
                                        <CustomLink
                                            variant="BLUE"
                                            to={getRulesPageUrl(locale)}
                                            target="_blank"
                                        >
                                            офертой
                                        </CustomLink>
                                    </span>
                                </label>
                                {errors.offer && (
                                    <p className={styles.fieldError}>{errors.offer}</p>
                                )}

                                <label htmlFor="privacy-check" className={styles.checkboxRow}>
                                    <input
                                        id="privacy-check"
                                        type="checkbox"
                                        checked={isPrivacyAccepted}
                                        onChange={(e) => {
                                            setPrivacyAccepted(e.target.checked);
                                            setErrors((prev) => ({
                                                ...prev,
                                                privacy: undefined,
                                            }));
                                        }}
                                    />
                                    <span>
                                        Соглашаюсь на обработку
                                        {" "}
                                        <CustomLink
                                            variant="BLUE"
                                            to={getPrivacyPolicyPageUrl(locale)}
                                            target="_blank"
                                        >
                                            персональных данных
                                        </CustomLink>
                                    </span>
                                </label>
                                {errors.privacy && (
                                    <p className={styles.fieldError}>{errors.privacy}</p>
                                )}
                            </div>

                            <div className={styles.submitRow}>
                                <Button
                                    color="BLUE"
                                    size="LARGE"
                                    variant="FILL"
                                    type="submit"
                                >
                                    Пожертвовать
                                </Button>
                            </div>
                        </section>
                    </div>
                </form>

                {successMessage && (
                    <div className={styles.errorBox}>{successMessage}</div>
                )}

                <div className={styles.backLink}>
                    <Button
                        color="GRAY"
                        size="MEDIUM"
                        variant="TEXT"
                        onClick={() => navigate(-1)}
                    >
                        Вернуться на страницу проекта
                    </Button>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default PaymentPage;
