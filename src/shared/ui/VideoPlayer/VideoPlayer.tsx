import React, { CSSProperties, useState } from "react";
import ReactPlayer from "react-player";
import styles from "./VideoPlayer.module.scss";

interface VideoPlayerProps {
    url: string;
    width?: string | number;
    height?: string | number;
    controls?: boolean;
    light?: boolean | string;
    playing?: boolean;
    style?: CSSProperties;
}

const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
    const {
        url,
        width = "100%",
        height = "100%",
        controls = true,
        light = false,
        playing = false,
        style,
    } = props;
    const [isPlaying, setIsPlaying] = useState<boolean>(playing);

    const isVkVideo = url.includes("vk.com") || url.includes("vkvideo.ru");

    const getVkEmbedUrl = (urlVideo: string): string | null => {
        try {
            const oidAndIdMatch = urlVideo.match(/video(-?\d+)_(\d+)/);
            if (oidAndIdMatch && oidAndIdMatch.length === 3) {
                const oid = oidAndIdMatch[1];
                const id = oidAndIdMatch[2];
                return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2&autoplay=${isPlaying ? "1" : "0"}`;
            }
            return null;
        } catch {
            return null;
        }
    };

    const getVkPreviewUrl = (urlVideo: string): string | null => {
        try {
            const oidAndIdMatch = urlVideo.match(/video(-?\d+)_(\d+)/);
            if (oidAndIdMatch && oidAndIdMatch.length === 3) {
                const oid = oidAndIdMatch[1];
                const id = oidAndIdMatch[2];
                return `https://vk.com/thumb/${oid}_${id}`;
            }
            return null;
        } catch {
            return null;
        }
    };

    if (isVkVideo) {
        const vkEmbedUrl = getVkEmbedUrl(url);
        const vkPreviewUrl = getVkPreviewUrl(url);

        if (!vkEmbedUrl) {
            return (
                <div className={styles.error}>
                    <p>Неподдерживаемая ссылка на видео.</p>
                </div>
            );
        }

        if (light && !isPlaying) {
            return (
                <div
                    className={styles.lightPreview}
                    style={{
                        width,
                        height,
                        backgroundImage: `url(${vkPreviewUrl || ""})`,
                        backgroundSize: "cover",
                        position: "relative",
                    }}
                    onClick={() => setIsPlaying(true)}
                >
                    <div className={styles.playButton} aria-label="Play" />
                </div>
            );
        }

        return (
            <div className={styles.wrapper} style={style}>
                <iframe
                    title={vkEmbedUrl}
                    src={vkEmbedUrl}
                    width={width}
                    height={height}
                    frameBorder="0"
                    allow="encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                    allowFullScreen
                />
            </div>
        );
    }

    if (ReactPlayer.canPlay(url)) {
        return (
            <div className={styles.wrapper}>
                <ReactPlayer
                    style={style}
                    url={url}
                    width={width}
                    height={height}
                    controls={controls}
                    light={light}
                    playing={playing}
                />
            </div>
        );
    }

    return (
        <div className={styles.error}>
            <p>Неподдерживаемая ссылка на видео.</p>
        </div>
    );
};

export default VideoPlayer;
