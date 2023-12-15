import * as z from "zod";

export const formSchema = z.object({
    title: z
        .string()
        .min(5, { message: "Заголовок слишком короткий" })
        .max(100, { message: "Заголовок слишком большой" }),
    description: z
        .string()
        .min(200, {
            message:
                "Описание статьи должно достигать как минимум 200 символов",
        })
        .max(30000, {
            message: "Описание статьи может достигать не больше 30000 символов",
        })
        .trim(),
});
