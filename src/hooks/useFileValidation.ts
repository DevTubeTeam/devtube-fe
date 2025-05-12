export const useFileValidation = () => {
    const validateFile = (file: File | null): string | null => {
        if (!file) return "Please select a video file";
        const validTypes = ["video/mp4", "video/mpeg", "video/webm"];
        if (!file.type || !validTypes.includes(file.type)) {
            return "Invalid file type. Only MP4, MPEG, and WebM are supported";
        }
        return null;
    };

    const validateMetadata = (title: string, description: string): string | null => {
        if (!title || !description) {
            return "Please provide a title and description";
        }
        return null;
    };

    return { validateFile, validateMetadata };
};

