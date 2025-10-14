import fs from "fs";
import { google } from "googleapis";

const credentials = JSON.parse(fs.readFileSync("./src/config/credentials.json", "utf8"));

const auth = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

(async () => {
  const res = await drive.files.list({
    q: "'1nQTKksCVedKtt0hJqWyZQ8T57EMmjR0P' in parents",
    fields: "files(id, name)",
    supportsAllDrives: true,
  });
  console.log("📁 SA có thể thấy thư mục không:", res.data.files);
})();
