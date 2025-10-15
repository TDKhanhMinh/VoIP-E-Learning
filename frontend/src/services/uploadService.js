import axios from "axios";
import http from './http';
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = "VoIPElearning";
const FOLDER = "submission";


export const uploadService = {
    uploadFile: async (file, onProgress) => {
        if (!file) throw new Error("No file provided for upload.");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", FOLDER);
        formData.append("resource_type", "raw");

        console.log("file info ", file.name, file.type, file.size);


        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        if (onProgress) {
                            const percent = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            onProgress(percent);
                        }
                    },
                }
            );

            const { secure_url, public_id, original_filename, format } = res.data;
            console.log("result cloudinary", res.data);

            return {
                url: secure_url,
                // url: public_id,
                public_id,
                file_name: `${original_filename}.${format}`,
            };
        } catch (error) {
            console.error(" Upload failed:", error);
            throw new Error("Upload failed. Please try again.");
        }
    },
    downloadUrl: async (public_id) => {
        const res = await http.post("/file/download", { public_id: public_id });
        return res.data.downloadUrl;
    }
};
