import React, { FC, useCallback } from "react";
import cn from "classnames";
import styles from "./TermsApplication.module.scss";
import DateInput from "@/shared/ui/DateInput/DateInput";
import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";
import { successIcon } from "@/shared/data/icons/skills";
import Button from "@/shared/ui/Button/Button";

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
    onChange: (terms: DateType) => void
}

export const TermsApplication: FC<TermsApplicationProps> = (props) => {
    const {
        className, onChange, terms, max, min, isHost, isSuccess = false,
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

    const renderLine = () => {
        if (!isHost) {
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
                        <p>{terms.start?.toDateString()}</p>
                    )
                        : (
                            <DateInput
                                className={styles.leftInput}
                                calendarClassName={styles.calendarInner}
                                calendarWrapperClassName={styles.calendar}
                                onDateChange={handleFromDateChange}
                                value={terms?.start}
                                min={min}
                                inputDisabled
                                isScrollTo
                            />
                        )}
                </div>
                <div className={styles.group}>
                    <span>Отъезд</span>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                        {isSuccess ? (
                            <p>{terms.end?.toDateString()}</p>
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
                                    inputDisabled
                                    isScrollTo
                                />
                                <IconButtonComponent
                                    wrapperClassName={styles.wrapperButton}
                                    disabledClassName={styles.disabled}
                                    disabled={!((terms.start && terms.end))}
                                    className={cn(styles.iconButton)}
                                    icon={successIcon}
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
                    <Button color="BLUE" size="SMALL" variant="FILL">Принять</Button>
                    <Button color="GRAY" size="SMALL" variant="OUTLINE">Отклонить</Button>
                </div>
            )}
        </div>
    );
};
