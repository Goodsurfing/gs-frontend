const alphaNumericCharachters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

export const generateState = (length: number) => {
    let state = "";

    const alphaNuremicCharactersLength = alphaNumericCharachters.length;

    for (let i = 0; i < length; i++) {
        state += alphaNumericCharachters
            .charAt(Math.floor(Math.random() * alphaNuremicCharactersLength));
    }

    return state;
};

export function generateCodeVerifier(length: number = 64): string {
    if (length < 43 || length > 128) {
        throw new Error("length must be between 43 and 128");
    }

    const array = new Uint32Array(length);

    if (typeof crypto === "undefined" || typeof crypto.getRandomValues !== "function") {
        throw new Error("crypto.getRandomValues is not available in this environment");
    }

    crypto.getRandomValues(array);

    let result = "";
    const charsLen = alphaNumericCharachters.length;

    for (let i = 0; i < length; i++) {
        result += alphaNumericCharachters[array[i] % charsLen];
    }

    return result;
}

function base64urlEncode(arrayBuffer: ArrayBuffer): string {
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

/**
 * Генерирует `code_challenge` из переданного `code_verifier` по алгоритму PKCE S256.
 *
 * Согласно спецификации PKCE, `code_challenge` — это:
 *   base64urlencode(SHA256(code_verifier))
 *
 * @param codeVerifier - Строка `code_verifier`, сгенерированная на этапе авторизации.
 *                       Должна содержать только разрешённые символы (A-Z, a-z, 0-9, "_", "-")
 *                       и иметь длину от 43 до 128 символов.
 * @returns Promise, который разрешается в строку `code_challenge` в формате Base64URL.
 *
 * @example
 * ```ts
 * const verifier = generateCodeVerifier();
 * const challenge = await generateCodeChallenge(verifier);
 * console.log({ verifier, challenge });
 * ```
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7636 PKCE RFC 7636}
 */
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);

    const digest = await crypto.subtle.digest("SHA-256", data);
    return base64urlEncode(digest);
}
