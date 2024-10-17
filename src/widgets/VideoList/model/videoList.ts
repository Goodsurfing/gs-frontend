export interface VideoListProps {
    videosURL: string[];
    onDelete: (videoURL: string) => void;
}
