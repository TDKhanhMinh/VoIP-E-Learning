import { deleteFileFromDrive, uploadFileToDrive } from "../service/driveService.js";

export const uploadFile = async (req, res) => {
    try {
        const { path, originalname, mimetype } = req.file;

        const result = await uploadFileToDrive(path, originalname, mimetype);

        res.status(200).json({
            success: true,
            message: "Upload thành công!",
            data: result,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        await deleteFileFromDrive(fileId);
        res.json({ success: true, message: "Đã xóa file khỏi Drive" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
