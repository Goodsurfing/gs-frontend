import React, { FC, useEffect, useState } from "react";
import { ImageType } from "@/components/ImageInput/types";

import { Profile } from "@/entities/Profile";
import { useUpdateProfileInfoMutation } from "@/entities/Profile/api/profileApi";

import { BASE_URL } from "@/shared/constants/api";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import { getMediaContentsApiArray } from "@/shared/lib/getMediaContent";
import { GalleryImages } from "@/shared/ui/GalleryImages/GalleryImages";
import { useGetVolunteerByIdQuery } from "@/entities/Volunteer";
import { MediaObjectType } from "@/types/media";

interface UploadMultipleImagesProps {
    profileData: Profile;
    label: string;
    isLoading: boolean;
    onChangeLoading: (value: boolean) => void;
    onChangeError: (value: boolean) => void;
    onChangeSuccess: (value: boolean) => void;
    className?: string;
}

export const UploadMultipleImages: FC<UploadMultipleImagesProps> = (props) => {
    const {
        label,
        isLoading,
        onChangeError,
        onChangeLoading,
        onChangeSuccess,
        className,
        profileData,
    } = props;
    const [inputImg, setInputImg] = useState<ImageType>({
        file: null,
        src: null,
    });
    const [galleryImgs, setGalleryImgs] = useState<MediaObjectType[]>([]);

    const [updateProfile] = useUpdateProfileInfoMutation();
    const { refetch: refetchVolunteer } = useGetVolunteerByIdQuery(profileData.id);

    useEffect(() => {
        if (profileData) {
            setGalleryImgs(profileData.galleryImages);
        } else {
            setGalleryImgs([]);
        }
    }, [profileData]);

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
                                profileData.galleryImages,
                            );
                            await updateProfile({
                                userId: profileData.id,
                                profileData: {
                                    galleryImages: [
                                        ...currentGalleryImages,
                                        mediaObject,
                                    ],
                                },
                            }).unwrap();
                            onChangeSuccess(true);
                            refetchVolunteer();
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
        const currentGalleryImages = profileData.galleryImages;

        const updatedGalleryImages = currentGalleryImages.filter(
            (image) => image.id !== imageId,
        );

        await updateProfile({
            userId: profileData.id,
            profileData: {
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
