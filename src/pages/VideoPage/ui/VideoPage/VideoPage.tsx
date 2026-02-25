import React, { useEffect, useState } from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { MemberBanner } from "@/features/MemberBanner";

import { Category } from "../Category/Category";
import { Header } from "../Header/Header";
import { VideoFilter } from "../VideoFilter/VideoFilter";
import { VideoList } from "../VideoList/VideoList";
import { VideoSearch } from "../VideoSearch/VideoSearch";
import { useLocale } from "@/app/providers/LocaleProvider";
import { TagsOption } from "@/features/Article";
import { AdminSort } from "@/entities/Admin";
import {
    useCreateVideoMutation, useLazyGetVideoListQuery,
    videoApiAdapter, videoCardAdapter, VideoFields,
} from "@/entities/Video";
import { VideoModalForm } from "@/features/Video/ui/VideoModalForm/VideoModalForm";
import { OfferPagination } from "@/widgets/OffersMap";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./VideoPage.module.scss";

const limit = 10;

const getSortByFilter = (filter: TagsOption): AdminSort => {
    switch (filter) {
        case "popular":
            return AdminSort.LikeCountDesc;
        case "new":
        default:
            return AdminSort.CreatedDesc;
    }
};

const VideoPage = () => {
    const { locale } = useLocale();
    const [filterValue, setFilterValue] = useState<TagsOption>("new");
    const [searchValue, setSearchValue] = useState<string>("");
    const [categoryValue, setCategoryValue] = useState<number | undefined>();
    const [toast, setToast] = useState<ToastAlert>();
    const [page, setPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialVideoData, setInitialVideoData] = useState<VideoFields | null>(null);

    const [getVideoList, { data, isLoading, isFetching }] = useLazyGetVideoListQuery();
    const [createVideo, { isLoading: isCreateVideoLoading }] = useCreateVideoMutation();

    useEffect(() => {
        getVideoList({
            page,
            limit,
            sort: getSortByFilter(filterValue),
            lang: locale,
            name: searchValue,
            categoryId: categoryValue,
        });
    }, [page, filterValue, searchValue, locale, categoryValue, getVideoList]);

    const totalPages = data?.pagination
        ? Math.ceil(data.pagination.total / data.pagination.limit)
        : 1;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleAddVideoClick = () => {
        setInitialVideoData(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setInitialVideoData(null);
    };

    const handleSubmitVideo = async (dataForm: VideoFields) => {
        try {
            await createVideo(videoApiAdapter(dataForm)).unwrap();
            handleCloseModal();
            setToast({ text: "Видео успешно добавлено", type: HintType.Success });
            setPage(1);
            getVideoList({
                page: 1,
                limit,
                sort: getSortByFilter(filterValue),
                lang: locale,
                name: searchValue,
                categoryId: categoryValue,
            });
        } catch (error) {
            setToast({ text: "Ошибка при добавлении видео", type: HintType.Error });
        }
    };

    return (
        <MainPageLayout>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <Header />
            <div className={styles.container}>
                <div className={styles.top}>
                    <VideoFilter
                        className={styles.videoFilter}
                        value={filterValue}
                        onChange={setFilterValue}
                        onAddVideoClick={handleAddVideoClick}
                    />
                    <VideoSearch
                        value={searchValue}
                        onChange={(value) => { setSearchValue(value); }}
                    />
                </div>
                <div className={styles.content}>
                    {(isLoading || isFetching) ? (<MiniLoader />) : (
                        <div className={styles.videoListWrapper}>
                            <VideoList
                                className={styles.newsList}
                                data={videoCardAdapter(data?.data ?? [])}
                            />
                            <OfferPagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                    <div
                        className={styles.right}
                    >
                        <Category
                            className={styles.category}
                            locale={locale}
                            value={categoryValue}
                            onChange={setCategoryValue}
                        />
                        <MemberBanner className={styles.memberBanner} />
                    </div>
                </div>
            </div>
            <VideoModalForm
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitVideo}
                initialData={initialVideoData}
                isLoading={isCreateVideoLoading}
                locale={locale}
            />
        </MainPageLayout>
    );
};

export default VideoPage;
