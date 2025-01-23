import React, { FC, useEffect, useState } from "react";
import { ImageType } from "@/components/ImageInput/types";

import { Host, useUpdateHostMutation } from "@/entities/Host";

import { BASE_URL } from "@/shared/constants/api";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import {
    getMediaContentsApiArray,
} from "@/shared/lib/getMediaContent";
import { GalleryImages } from "@/shared/ui/GalleryImages/GalleryImages";
import { MediaObjectType } from "@/types/media";

interface HostUploadMultipleImagesProps {
    host: Host;
    label: string;
    isLoading: boolean;
    onChangeLoading: (value: boolean) => void;
    onChangeError: (value: boolean) => void;
    onChangeSuccess: (value: boolean) => void;
    className?: string;
}

export const HostUploadMultipleImages: FC<HostUploadMultipleImagesProps> = (
    props,
) => {
    const {
        label,
        isLoading,
        onChangeError,
        onChangeLoading,
        onChangeSuccess,
        className,
        host,
    } = props;
    const [inputImg, setInputImg] = useState<ImageType>({
        file: null,
        src: null,
    });
    const [galleryImgs, setGalleryImgs] = useState<MediaObjectType[]>([]);

    const [updateHost] = useUpdateHostMutation();

    useEffect(() => {
        if (host) {
            setGalleryImgs(host.galleryImages);
        } else {
            setGalleryImgs([]);
        }
    }, [host]);

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
                            const currentGalleryImages = getMediaContentsApiArray(
                                host.galleryImages,
                            );
                            await updateHost({
                                id: host.id,
                                body: {
                                    galleryImages: [
                                        ...currentGalleryImages,
                                        mediaObject,
                                    ],
                                },
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

    const handleCloseBtnClick = async (imageId: string) => {
        const currentGalleryImages = host.galleryImages;

        const updatedGalleryImages = currentGalleryImages.filter(
            (image) => image.id !== imageId,
        );

        await updateHost({
            id: host.id,
            body: {
                galleryImages: getMediaContentsApiArray(updatedGalleryImages),
            },
        })
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
            classNameWrapper={className}
            checkImageSize={false}
        />
    );
};
