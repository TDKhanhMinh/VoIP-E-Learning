import mysql from "mysql2/promise";

/**
 * Đồng bộ user MongoDB sang Asterisk MySQL Realtime
 * @param {Object} user - user từ MongoDB
 */
export const syncUserToAsterisk = async (user) => {
    const connection = await mysql.createConnection({
        host: "47.128.235.25", // IP EC2 đang chạy Asterisk
        user: "asterisk_user",
        password: "StrongPass123",
        database: "asterisk_realtime",
    });

    const userId = user._id.toString();
    const username = user.email;
    const plainPassword = user.passwordPlain || "1234"; // tuỳ vào nơi bạn lưu password gốc

    // 1️⃣ Endpoint (điểm kết nối SIP)
    await connection.query(
        `REPLACE INTO pjsip_endpoints 
    (id, transport, aors, auth, context, disallow, allow, webrtc, dtls_auto_generate_cert, media_encryption, dtls_setup, dtls_verify, use_avpf, ice_support, rtcp_mux, force_rport, rewrite_contact)
    VALUES (?, 'transport-wss', ?, ?, 'from-internal', 'all', 'ulaw,alaw,opus,vp8,h264', 'yes', 'yes', 'dtls', 'actpass', 'fingerprint', 'yes', 'yes', 'yes', 'yes', 'yes')`,
        [userId, userId, userId]
    );

    // 2️⃣ Auth (thông tin đăng nhập SIP)
    await connection.query(
        `REPLACE INTO pjsip_auths (id, auth_type, username, password)
     VALUES (?, 'userpass', ?, ?)`,
        [userId, username, plainPassword]
    );

    // 3️⃣ AOR (địa chỉ liên lạc)
    await connection.query(
        `REPLACE INTO pjsip_aors (id, max_contacts)
     VALUES (?, 1)`,
        [userId]
    );

    await connection.end();
    console.log(`✅ Đồng bộ user ${username} sang Asterisk thành công`);
};
