import React, { FormEvent, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import Button from "@/shared/ui/Button/Button";
import Input from "@/shared/ui/Input/Input";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { useLocale } from "@/app/providers/LocaleProvider";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { useGetDonationByIdQuery } from "@/entities/Donation/api/donationApi";
import { useCreateDonationPaymentMutation } from "@/store/api/donationPaymentApi";
import { getDonationPersonalPage, getSignInPageUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";

import styles from "./DonationPayPage.module.scss";

const PRESET_AMOUNTS = [300, 1500, 5000];

interface FormErrors {
    amount?: string;
}

const DonationPayPage: React.FC = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { id: fundraiseId } = useParams<{ id: string }>();
    const { isAuth } = useAuth();

    const { data: fundraise, isLoading: isFundraiseLoading } = useGetDonationByIdQuery(
        { id: fundraiseId || "", lang: locale },
        { skip: !fundraiseId },
    );

    const [createDonation, { isLoading: isCreating }] = useCreateDonationPaymentMutation();

    const [selectedAmount, setSelectedAmount] = useState<number | null>(1500);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);

    const amount = useMemo(() => {
        if (selectedAmount !== null) return selectedAmount;
        const numericValue = Number(customAmount);
        return Number.isFinite(numericValue) ? numericValue : 0;
    }, [selectedAmount, customAmount]);

    if (!isAuth) {
        navigate(getSignInPageUrl(locale));
        return null;
    }

    const validate = (): boolean => {
        const nextErrors: FormErrors = {};
        if (!Number.isFinite(amount) || amount < 100) {
            nextErrors.amount = "Минимальная сумма пожертвования — 100 ₽";
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setApiError(null);

        if (!validate() || !fundraiseId) return;

        try {
            const result = await createDonation({
                fundraiseId,
                amount,
                isAnonymous,
            }).unwrap();

            if (result.paymentUrl) {
                window.location.href = result.paymentUrl;
            }
        } catch (err: any) {
            setApiError(err?.data?.error || "Произошла ошибка при создании платежа");
        }
    };

    if (isFundraiseLoading) {
        return (
            <MainPageLayout>
                <div className={styles.loading}><Preloader /></div>
            </MainPageLayout>
        );
    }

    const imageUrl = fundraise?.image?.contentUrl
        ? getMediaContent(fundraise.image.contentUrl)
        : undefined;

    return (
        <MainPageLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>Пожертвование</h1>
                <p className={styles.subtitle}>
                    Поддержите проект — любая сумма важна
                </p>

                {fundraise && (
                    <div className={styles.projectCard}>
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={fundraise.name || ""}
                                className={styles.projectImage}
                            />
                        )}
                        <div className={styles.projectContent}>
                            <span className={styles.projectTag}>Сбор пожертвований</span>
                            <h2 className={styles.projectTitle}>{fundraise.name}</h2>
                            <p className={styles.projectOrg}>{fundraise.organization?.name}</p>
                        </div>
                    </div>
                )}

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
                                            setErrors({});
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
                                    min={100}
                                    label="Другая сумма, ₽"
                                    value={customAmount}
                                    onChange={(e) => {
                                        setSelectedAmount(null);
                                        setCustomAmount(e.target.value);
                                        setErrors({});
                                    }}
                                />
                            </div>

                            {errors.amount && (
                                <p className={styles.fieldError}>{errors.amount}</p>
                            )}
                        </section>

                        <section>
                            <h3 className={styles.sectionTitle}>Настройки</h3>

                            <div className={styles.checkboxes}>
                                <label htmlFor="anonymous-check" className={styles.checkboxRow}>
                                    <input
                                        id="anonymous-check"
                                        type="checkbox"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                    />
                                    <span>Анонимное пожертвование</span>
                                </label>
                            </div>

                            <div className={styles.submitRow}>
                                <Button
                                    color="BLUE"
                                    size="LARGE"
                                    variant="FILL"
                                    type="submit"
                                    disabled={isCreating}
                                >
                                    {isCreating ? "Создание платежа..." : `Поддержать — ${amount} ₽`}
                                </Button>
                            </div>
                            <p className={styles.offerNote}>
                                {"Нажимая кнопку, вы принимаете условия "}
                                <a
                                    href="/assets/docs/npo/Публичная_оферта.pdf"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    публичной оферты
                                </a>
                                {" о заключении договора пожертвования."}
                            </p>
                        </section>
                    </div>
                </form>

                {apiError && (
                    <div className={styles.errorBox}>{apiError}</div>
                )}

                <div className={styles.backLink}>
                    <Button
                        color="GRAY"
                        size="MEDIUM"
                        variant="TEXT"
                        onClick={() => navigate(getDonationPersonalPage(locale, fundraiseId))}
                    >
                        Вернуться на страницу сбора
                    </Button>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default DonationPayPage;
