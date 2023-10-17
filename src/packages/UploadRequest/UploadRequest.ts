import { Storage } from "../Storage";
import { Scanner } from "../Scanner";
import { ImageScaler } from "../ImageScaller";

type Attachment = {
    file: File;
};

const IMAGE_SCALE_WIDTH = 300;
const IMAGE_SCALE_HEIGHT = 300;

export class UploadRequest {
    private readonly scanner: Scanner;

    private readonly storage: Storage;

    private readonly scaler: ImageScaler;

    private readonly IMAGE_SCALE_STATS = {
        width: IMAGE_SCALE_WIDTH,
        height: IMAGE_SCALE_HEIGHT,
    };

    constructor(storage: Storage, scanner: Scanner, scaler: ImageScaler) {
        this.scanner = scanner;
        this.storage = storage;
        this.scaler = scaler;
    }

    async upload(attachment: Attachment) {
        if (await this.scanner.scan(attachment.file)) {
            throw new Error("File didn't pass scanner check.");
        }
        const scaledImage = await this.scaler.scaleImage(
            attachment.file,
            this.IMAGE_SCALE_STATS.width,
            this.IMAGE_SCALE_STATS.height,
        );
        return this.storage.upload({
            fileName: scaledImage.name,
        });
    }
}
