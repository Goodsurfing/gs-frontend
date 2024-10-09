import React, { FC, useEffect, useState } from "react";
import { ImageType } from "@/components/ImageInput/types";
import { GalleryItem } from "@/types/media";

import {
    useCreateOfferGalleryItemMutation,
    useDeleteOfferGalleryItemMutation,
    useGetOfferGalleryItemsQuery,
} from "@/entities/Offer/api/offerApi";

import { BASE_URL } from "@/shared/constants/api";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import { GalleryImages } from "@/shared/ui/GalleryImages/GalleryImages";

interface ExtraImagesUploadProps {
    label: string;
    offerId: string;
    isLoading: boolean;
    onChangeLoading: (value: boolean) => void;
    onChangeError: (value: boolean) => void;
    onChangeSuccess: (value: boolean) => void;
    classNameWrapper?: string;
}

const ExtraImagesUpload: FC<ExtraImagesUploadProps> = (props) => {
    const {
        classNameWrapper,
        label,
        isLoading,
        onChangeLoading,
        onChangeError,
        onChangeSuccess,
        offerId,
    } = props;
    const [inputImg, setInputImg] = useState<ImageType>({
        file: null,
        src: null,
    });
    const [galleryImgs, setGalleryImgs] = useState<GalleryItem[]>([]);

    const [createGalleryItem] = useCreateOfferGalleryItemMutation();
    const [deleteGalleryItem] = useDeleteOfferGalleryItemMutation();
    const { data: galleryData } = useGetOfferGalleryItemsQuery(offerId);

    useEffect(() => {
        if (galleryData) {
            setGalleryImgs(galleryData);
        } else {
            setGalleryImgs([]);
        }
    }, [galleryData]);

    const handleImageUpload = (img: ImageType) => {
        const { file } = img;
        onChangeLoading(true);
        onChangeError(false);
        onChangeSuccess(false);
        if (file) {
            uploadFile(file.name, file)
                .then(async (result) => {
                    try {
                        if (result && result["@id"]) {
                            const mediaObject = `${BASE_URL}${result[
                                "@id"
                            ].slice(1)}`;
                            const formData = new FormData();
                            formData.append("mediaObject", mediaObject);
                            await createGalleryItem({
                                offerId,
                                formData,
                            }).unwrap();
                            onChangeSuccess(true);
                        } else {
                            onChangeError(true);
                        }
                    } catch {
                        onChangeError(true);
                    }
                })
                .catch(() => {
                    onChangeError(true);
                })
                .finally(() => {
                    onChangeLoading(false);
                    setInputImg((prev) => ({ ...prev, file: null, src: null }));
                });
        } else {
            onChangeLoading(false);
        }
    };

    const handleCloseBtnClick = (imageId: string) => {
        deleteGalleryItem({ offerId, galleryId: imageId })
            .unwrap()
            .then(() => {
                onChangeSuccess(true);
            })
            .catch(() => {
                onChangeError(true);
            });
    };

    return (
        <GalleryImages
            label={label}
            inputImg={inputImg}
            galleryImgs={galleryImgs}
            handleImageUpload={handleImageUpload}
            handleCloseBtnClick={handleCloseBtnClick}
            isLoading={isLoading}
            classNameWrapper={classNameWrapper}
        />
    );
};

export default ExtraImagesUpload;
