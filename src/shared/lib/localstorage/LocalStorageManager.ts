import CryptoJS from "crypto-js";

const secretKey = "фывфыв";

export const encryptData = (
    data: any,
) => CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();

export const decryptData = (data: any) => {
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

class LocalStorageManager {
    static setItem(key: string, data: any) {
        const encryptedValue = encryptData(data);
        localStorage.setItem(key, encryptedValue);
    }

    static getItem(key: string) {
        const value = localStorage.getItem(key);
        try {
            return decryptData(value);
        } catch (e) {
            return value;
        }
    }

    static removeItem(key: string) {
        const value = this.getItem(key);
        localStorage.removeItem(key);
        return value;
    }

    static clear() {
        localStorage.clear();
    }
}

export default LocalStorageManager;
