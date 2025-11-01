import mysql from "mysql2/promise";

/**
 * Đồng bộ user MongoDB sang Asterisk MySQL Realtime
 * (dùng email làm SIP ID, hỗ trợ WebRTC + WSS)
 */
export const syncUserToAsterisk = async (user) => {
  const connection = await mysql.createConnection({
    host: "13.212.12.146",        // EC2 IP MySQL
    user: "asteriskuser",
    password: "strongpassword",
    database: "asterisk",
  });

  // ✅ Lấy SIP ID từ email (trước dấu @)
  const userId = user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_");
  const username = userId;
  const plainPassword = user.passwordPlain || "1234"; // Tạm default nếu chưa có

  console.log(`🔄 Syncing user ${username} to Asterisk...`);

  // 1️⃣ ps_aors — giữ kết nối WebSocket ổn định
  await connection.query(
    `
    REPLACE INTO ps_aors (
      id,
      max_contacts,
      remove_existing,
      minimum_expiration,
      maximum_expiration,
      default_expiration,
      qualify_frequency
    )
    VALUES (?, 2, 1, 60, 3600, 3600, 60)
    `,
    [userId]
  );

  // 2️⃣ ps_auths — xác thực user/pass SIP
  await connection.query(
    `
    REPLACE INTO ps_auths (
      id,
      auth_type,
      username,
      password
    )
    VALUES (?, 'userpass', ?, ?)
    `,
    [userId, username, plainPassword]
  );

  // 3️⃣ ps_endpoints — ánh xạ endpoint → auth + aor (WebRTC Ready)
  await connection.query(
    `
  REPLACE INTO ps_endpoints (
    id,
    transport,
    aors,
    auth,
    context,
    disallow,
    allow,
    direct_media,
    force_rport,
    rewrite_contact,
    dtmf_mode,
    ice_support,
    webrtc,
    media_encryption,
    rtp_symmetric,
    force_avp,
    media_use_received_transport,
    dtls_auto_generate_cert,
    media_encryption_optimistic,
    allow_overlap,
    callerid
  )
  VALUES (
    ?, 'transport-wss', ?, ?, 'from-internal',
    'all', 'ulaw,alaw,opus',
    'no', 'yes', 'yes', 'rfc4733',
    'yes', 'yes', 'dtls',
    'yes', 'yes', 'yes', 'no', 'yes', 'no', ?
  )
  `,
    [userId, userId, userId, `"${username}" <${username}>`]
  );


  await connection.end();
  console.log(`✅ Đồng bộ user ${username} (${userId}) sang Asterisk thành công`);
};
