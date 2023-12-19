import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import cn from "classnames";
import React, { FC, memo } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import Button from "@/shared/ui/Button/Button";
import Input from "@/shared/ui/Input/Input";
import { TextEditor } from "@/shared/ui/TextEditor/TextEditor";

import { formSchema } from "../../model/articleForm";
import styles from "./ArticleForm.module.scss";
import UploadButton from "@/modules/Gallery/ui/UploadButton/UploadButton";
import { UploadArticleCover } from "../UploadArticleCover/UploadArticleCover";

interface ArticleFormProps {
    className?: string;
}

export const ArticleForm: FC<ArticleFormProps> = memo(
    (props: ArticleFormProps) => {
        const { className } = props;
        const {
            register,
            handleSubmit,
            formState: { errors },
            control,
        } = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            mode: "onChange",
            defaultValues: {
                title: "",
                description: "",
            },
        });

        const onSubmit = (data: z.infer<typeof formSchema>) => {
            console.log(data);
        };

        const handleUpdateImages = (image: File) => {

        };

        return (
            <form
                className={cn(className, styles.wrapper)}
                onSubmit={handleSubmit(onSubmit)}
            >
                <span>Заголовок</span>
                <UploadArticleCover id="upload cover" />
                <TextField
                    {...register("title")}
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                    variant="outlined"
                    placeholder="Заголовок вашей статьи"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            borderColor: "var(--text-caption)",
                        },
                    }}
                />
                <span>Описание</span>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextEditor
                            onChange={field.onChange}
                            value={field.value}
                        />
                    )}
                />
                <Button color="BLUE" variant="FILL" size="SMALL">
                    Сохранить
                </Button>
            </form>
        );
    },
);
