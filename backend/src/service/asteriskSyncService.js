import mysql from "mysql2/promise";


export const syncUserToAsterisk = async (user) => {
  const connection = await mysql.createConnection({
    host: "52.77.226.38", 
    user: "asteriskuser",
    password: "strongpassword",
    database: "asterisk",
  });

  const userId = user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_");
  const username = userId;
  const plainPassword = user.passwordPlain; 

  console.log(`Syncing user ${username} to Asterisk...`);

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
    'all', 'opus',
    'no', 'yes', 'yes', 'rfc4733',
    'yes', 'yes', 'dtls',
    'yes', 'yes', 'yes', 'no', 'yes', 'no', ?
  )
  `,
    [userId, userId, userId, `"${username}" <${username}>`]
  );


  await connection.end();
  console.log(`Đồng bộ user ${username} (${userId}) sang Asterisk thành công`);
};
