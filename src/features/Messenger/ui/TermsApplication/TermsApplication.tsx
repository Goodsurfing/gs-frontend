import React, { FC, useCallback } from "react";
import cn from "classnames";
import styles from "./TermsApplication.module.scss";
import DateInput from "@/shared/ui/DateInput/DateInput";
import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";
import { successIcon } from "@/shared/data/icons/skills";
import { formatDate } from "@/shared/lib/formatDate";
import { Locale } from "@/entities/Locale";
import Button from "@/shared/ui/Button/Button";
import { FormApplicationStatus } from "@/entities/Application";

interface DateType {
    start: Date | undefined;
    end: Date | undefined
}

interface TermsApplicationProps {
    className?: string;
    isHost?: boolean;
    isSuccess: boolean;
    terms: DateType;
    min?: Date;
    max?: Date;
    locale: Locale;
    onChange: (terms: DateType) => void
    onSubmit?: () => void;
    onApplicationSubmit?: (value: FormApplicationStatus) => void;
}

export const TermsApplication: FC<TermsApplicationProps> = (props) => {
    const {
        className, onChange, onSubmit, onApplicationSubmit, terms, max, min, isHost,
        isSuccess = false, locale,
    } = props;

    const handleFromDateChange = useCallback((date: Date) => {
        if (terms.end) {
            if (date > terms.end) {
                onChange({ ...terms, start: date, end: date });
                return;
            }
        } else {
            onChange({ ...terms, start: date, end: date });
            return;
        }
        onChange({ ...terms, start: date });
    }, [onChange, terms]);

    const handleToDateChange = useCallback((date: Date) => {
        if (!terms.start) {
            onChange({ ...terms, start: new Date(), end: date });
        } else {
            if (date < terms.start) return;
            onChange({ ...terms, end: date });
        }
    }, [onChange, terms]);

    const handleApplicationSubmit = useCallback((status: FormApplicationStatus) => {
        onApplicationSubmit?.(status);
    }, [onApplicationSubmit]);

    const renderLine = () => {
        if (!isSuccess) {
            return (
                <span className={styles.line}>Укажите в какие даты вы хотите участвовать</span>
            );
        }
    };

    return (
        <div>
            {renderLine()}
            <div className={cn(styles.wrapper, className)}>
                <div className={styles.group}>
                    <span>Прибытие</span>
                    {isSuccess ? (
                        <p>{terms?.start && formatDate(locale, terms.start.toDateString())}</p>
                    )
                        : (
                            <DateInput
                                className={styles.leftInput}
                                calendarClassName={styles.calendarInner}
                                calendarWrapperClassName={styles.calendar}
                                onDateChange={handleFromDateChange}
                                value={terms?.start}
                                min={min}
                                isScrollTo
                            />
                        )}
                </div>
                <div className={styles.group}>
                    <span>Отъезд</span>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                        {isSuccess ? (
                            <p>{terms.end && formatDate(locale, terms.end.toDateString())}</p>
                        ) : (
                            <>
                                <DateInput
                                    className={styles.rightInput}
                                    calendarClassName={styles.calendarInner}
                                    calendarWrapperClassName={styles.calendar}
                                    onDateChange={handleToDateChange}
                                    value={terms?.end}
                                    min={new Date()}
                                    max={max}
                                    isScrollTo
                                />
                                <IconButtonComponent
                                    wrapperClassName={styles.wrapperButton}
                                    disabledClassName={styles.disabled}
                                    disabled={!((terms.start && terms.end))}
                                    className={cn(styles.iconButton)}
                                    icon={successIcon}
                                    onClick={onSubmit}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
            { isHost && (
                <div style={{
                    display: "flex",
                    gap: "10px",
                    width: "100%",
                    justifyContent: "center",
                    marginTop: "20px",
                }}
                >
                    <Button color="BLUE" size="SMALL" variant="FILL" onClick={() => handleApplicationSubmit("accepted")}>Принять</Button>
                    <Button color="GRAY" size="SMALL" variant="OUTLINE" onClick={() => handleApplicationSubmit("canceled")}>Отклонить</Button>
                </div>
            )}
        </div>
    );
};
