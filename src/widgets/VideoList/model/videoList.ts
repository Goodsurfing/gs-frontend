export interface VideoListProps {
    videosURL: string[];
    onDelete: (videoIndex: number) => void;
}
