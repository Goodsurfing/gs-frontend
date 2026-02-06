/**
 * Рекурсивно преобразует объект в FormData, обрабатывая вложенные файлы
 * @param data - Объект с данными
 * @param parentKey - Родительский ключ для вложенных полей (используется для рекурсии)
 * @param rootFormData - Корневой FormData (используется для рекурсии)
 * @returns FormData с подготовленными данными
 */
export function objectToFormData<T extends Record<string, any>>(
    data: T,
    parentKey: string = "",
    rootFormData: FormData = new FormData(),
): FormData {
    const formData = rootFormData;

    Object.entries(data).forEach(([key, value]) => {
        const formKey = parentKey ? `${parentKey}[${key}]` : key;

        if (value === null || value === undefined) {
            return;
        }

        if (value instanceof File) {
            formData.append(formKey, value);
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                const arrayKey = `${formKey}[${index}]`;
                if (typeof item === "object" && !(item instanceof File) && !(item instanceof Blob)) {
                    objectToFormData(item, arrayKey, formData);
                } else if (item instanceof File) {
                    formData.append(arrayKey, item);
                } else {
                    formData.append(arrayKey, String(item));
                }
            });
        } else if (typeof value === "object" && !(value instanceof Blob)) {
            objectToFormData(value, formKey, formData);
        } else {
            formData.append(formKey, String(value));
        }
    });

    return formData;
}
