export const checkWidthAndHeight = (file: File): Promise<{ width: number, height: number }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target && e.target.result) {
                const img = new Image();
                img.src = e.target.result as string;

                img.onload = () => {
                    const width = img.naturalWidth;
                    const height = img.naturalHeight;

                    resolve({ width, height });
                };

                img.onerror = () => {
                    reject(new Error("Error loading image"));
                }
            } else {
                reject(new Error("Error reading file"));
            }
        };

        reader.onerror = () => {
            reject(new Error("Error reading file"));
        };

        reader.readAsDataURL(file);        
    });

}