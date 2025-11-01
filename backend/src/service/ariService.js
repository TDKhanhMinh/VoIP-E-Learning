// // src/service/ariService.js
import AriClient from "ari-client";
import dotenv from "dotenv";
dotenv.config();

// const { ARI_URL, ARI_USER, ARI_PASS, ARI_APP } = process.env;

// let ari = null;
// const rooms = {}; // Lưu tạm các bridge (theo roomId)

// // ============================
// // 🔹 Kết nối tới ARI server
// // ============================
// export async function connectARI() {
//   if (ari) return ari; // tránh connect lại nhiều lần

//   try {
//     // ARI_URL có thể là http://13.212.12.146:8088 hoặc http://127.0.0.1:8088
//     ari = await AriClient.connect(ARI_URL, ARI_USER, ARI_PASS);
//     console.log("✅ Connected to Asterisk ARI:", ARI_URL);

//     // Đăng ký ứng dụng ARI (app trong ari.conf: apps = lms-app)
//     ari.start(ARI_APP);
//     console.log(`🚀 ARI app "${ARI_APP}" started`);

//     // ============================
//     // 🔸 Khi 1 channel bắt đầu gọi vào Stasis app
//     // ============================
//     ari.on("StasisStart", async (event, channel) => {
//       try {
//         const args = event.args || [];
//         const roomId = args[0] || "default";
//         const bridgeName = `room_${roomId}`;

//         console.log(`🎓 User joined app: ${channel.name} → ${bridgeName}`);

//         // Nếu bridge chưa có thì tạo mới
//         if (!rooms[bridgeName]) {
//           rooms[bridgeName] = await ari.bridges.create({
//             type: "mixing",
//             name: bridgeName,
//           });
//           console.log(`🆕 Created new bridge for ${bridgeName}`);
//         }

//         // Thêm channel vào bridge
//         await rooms[bridgeName].addChannel({ channel: channel.id });
//         console.log(`👥 Added ${channel.name} to ${bridgeName}`);

//         // ============================
//         // 🔸 Khi channel rời khỏi phòng
//         // ============================
//         channel.on("StasisEnd", async () => {
//           console.log(`👋 ${channel.name} left ${bridgeName}`);

//           // Nếu bridge trống → xóa để dọn dẹp
//           try {
//             const bridge = rooms[bridgeName];
//             if (bridge) {
//               const br = await ari.bridges.get({ bridgeId: bridge.id });
//               const chans = await br.listChannels();
//               if (chans.length === 0) {
//                 await br.destroy();
//                 delete rooms[bridgeName];
//                 console.log(`🗑️ Destroyed empty bridge: ${bridgeName}`);
//               }
//             }
//           } catch (cleanupErr) {
//             console.error("⚠️ Bridge cleanup error:", cleanupErr.message);
//           }
//         });
//       } catch (err) {
//         console.error("❌ StasisStart error:", err.message);
//       }
//     });

//     // Log các event hệ thống (optional, giúp debug)
//     ari.on("StasisEnd", (evt, ch) => {
//       console.log(`📴 Channel ${ch.name} ended`);
//     });

//     return ari;
//   } catch (err) {
//     console.error("❌ Failed to connect ARI:", err.message);
//     throw err;
//   }
// }

// // ============================
// // 🔹 Truy cập thông tin
// // ============================
// export function getARI() {
//   if (!ari) throw new Error("ARI chưa được kết nối, hãy gọi connectARI() trước");
//   return ari;
// }

// export function getRooms() {
//   return rooms;
// }
// src/service/ariService.js


const { ARI_URL, ARI_USER, ARI_PASS, ARI_APP } = process.env;

let ari = null;

/**
 * 📞 Xử lý khi có cuộc gọi mới được extensions.conf chuyển đến 'lms-app'
 * (Đây là luồng của HỌC VIÊN)
 */
const handleStasisStart = async (event, channel) => {
  // 1. Lấy bridgeId từ dialplan: Stasis(lms-app, ${EXTEN:11})
  // ${EXTEN:11} chính là 'room_...' mà frontend gọi đến
  const bridgeId = event.args[0];

  if (!bridgeId) {
    console.error("❌ Lỗi: Cuộc gọi vào Stasis nhưng không có bridgeId. Hủy cuộc gọi.");
    await channel.hangup();
    return;
  }

  console.log(`📞 Học viên mới [${channel.name}] đang gọi vào phòng [${bridgeId}]`);

  try {
    // 2. Trả lời cuộc gọi (bắt buộc)
    await channel.answer();
    console.log(`...đã trả lời kênh ${channel.name}`);

    // 3. Thêm kênh (học viên) này vào bridge (phòng học)
    // Bridge này được GIÁO VIÊN tạo ra trước đó thông qua roomService.js
    await ari.bridges.addChannel({
      bridgeId: bridgeId, // Dùng tên bridge (ví dụ: 'room_12345')
      channel: channel.id,
    });

    console.log(`✅ Đã thêm học viên [${channel.name}] vào phòng [${bridgeId}]`);
  } catch (err) {
    // Lỗi xảy ra nếu học viên gọi vào phòng KHÔNG TỒN TẠI
    // (ví dụ: giáo viên chưa tạo phòng, hoặc gõ sai ID)
    console.error(
      `❌ Lỗi khi thêm kênh ${channel.name} vào bridge ${bridgeId}: ${err.message}`
    );
    console.warn(`...Bridge ${bridgeId} có thể không tồn tại. Hủy cuộc gọi.`);
    await channel.hangup();
  }
};

/**
 * 🔹 Kết nối tới ARI server
 * (Chạy 1 lần duy nhất khi server Node.js khởi động)
 */
export async function connectARI() {
  if (ari) return ari; // Tránh connect lại

  try {
    console.log("Đang kết nối đến ARI:", ARI_URL);
    ari = await AriClient.connect(ARI_URL, ARI_USER, ARI_PASS);
    console.log("✅ Đã kết nối Asterisk ARI");

    // Lắng nghe các sự kiện lỗi
    ari.on("disconnect", () => console.error("❌ Đã mất kết nối ARI!"));
    ari.on("error", (err) => console.error("❌ Lỗi ARI:", err.message));

    // --- PHẦN QUAN TRỌNG NHẤT ---
    // Bắt đầu lắng nghe sự kiện StasisStart (khi có cuộc gọi mới)
    ari.on("StasisStart", handleStasisStart);

    // (Không cần StasisEnd ở đây, vì roomService.js sẽ xử lý việc dọn dẹp bridge)

    // Báo cho Asterisk biết app 'lms-app' đã sẵn sàng nhận sự kiện
    await ari.start(ARI_APP);
    console.log(`🎧 ARI app "${ARI_APP}" đang lắng nghe...`);
  } catch (err) {
    console.error("❌ Lỗi nghiêm trọng khi kết nối ARI!");
    throw err; // Ném lỗi để server.js biết và tắt đi
  }
}

/**
 * 🔹 Cung cấp ARI client cho các service khác (như roomService.js)
 * (Dùng để GIÁO VIÊN tạo bridge)
 */
export function getARI() {
  if (!ari) throw new Error("ARI chưa được kết nối, hãy gọi connectARI() trước");
  return ari;
}

// (Xóa getRooms() vì chúng ta không cần cache cục bộ nữa,
// chúng ta thao tác trực tiếp với Asterisk bằng tên bridge)