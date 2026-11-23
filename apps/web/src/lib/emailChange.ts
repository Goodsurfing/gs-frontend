/** Коды ошибок смены почты (gs-backend EmailChangeService) */
export const EMAIL_CHANGE_ERRORS = ["invalid_email", "same_email", "wrong_password", "reauth_required", "email_taken", "too_many_requests", "invalid_token", "old_email_taken", "unknown"] as const;
export type EmailChangeErrorCode = (typeof EMAIL_CHANGE_ERRORS)[number];

export function emailChangeErrorText(code: string | undefined, texts: Record<EmailChangeErrorCode, string>): string {
    return (EMAIL_CHANGE_ERRORS as readonly string[]).includes(code ?? "") ? texts[code as EmailChangeErrorCode] : texts.unknown;
}
