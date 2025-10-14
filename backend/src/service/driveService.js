import fs from "fs";
import { google } from "googleapis";
const KEYFILEPATH = "./src/config/credentials.json";
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const PARENT_FOLDER_ID = "1nQTKksCVedKtt0hJqWyZQ8T57EMmjR0P";

const credentials = JSON.parse(fs.readFileSync("./src/config/credentials.json", "utf8"));
const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
});
const drive = google.drive({ version: "v3", auth });


export async function uploadFileToDrive(filePath, fileName, mimeType) {
    try {
        const createRes = await drive.files.create({
            requestBody: { name: fileName },
            media: { mimeType, body: fs.createReadStream(filePath) },
            fields: "id, name, parents",
            supportsAllDrives: true,
        });

        const fileId = createRes.data.id;

        await drive.files.update({
            fileId,
            addParents: PARENT_FOLDER_ID,
            removeParents: "root",
            fields: "id, parents",
            supportsAllDrives: true,
        });

        await drive.permissions.create({
            fileId,
            requestBody: { role: "reader", type: "anyone" },
            supportsAllDrives: true,
        });

        const viewLink = `https://drive.google.com/file/d/${fileId}/view`;
        const downloadLink = `https://drive.google.com/uc?id=${fileId}&export=download`;

        fs.unlinkSync(filePath);
        return { id: fileId, viewLink, downloadLink };
    } catch (err) {
        console.error("Lỗi khi upload file:", err);
        throw new Error("Upload to Google Drive failed");
    }
}
export async function deleteFileFromDrive(fileId) {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: KEYFILEPATH,
            scopes: SCOPES,
        });
        const driveService = google.drive({ version: "v3", auth });
        await driveService.files.delete({ fileId });
        return true;
    } catch (err) {
        console.error("Lỗi khi xóa file:", err);
        throw new Error("Delete from Google Drive failed");
    }
}
