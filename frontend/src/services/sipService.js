import {
    UserAgent,
    Inviter,
    Registerer,
    SessionState
} from "sip.js";

let userAgent;
let registerer;
let session;

// 🧱 1️⃣ Khởi tạo SIP.js client
export async function initSip(config, localRef, remoteRef) {
    const uri = UserAgent.makeURI(`sip:${config.username}@${config.domain}`);
    if (!uri) throw new Error("URI không hợp lệ");

    console.log("🔗 Init SIP client:", uri.toString());

    // ✅ Cấu hình UserAgent (SIP.js client)
    userAgent = new UserAgent({
        uri,
        authorizationUsername: config.username,
        authorizationPassword: config.password,
        transportOptions: {
            server: config.wsServer, // ví dụ: wss://webrtc.voipelearning.shop:8089/ws
        },
        sessionDescriptionHandlerFactoryOptions: {
            constraints: { audio: true, video: true },
        },
    });

    // Khi nhận cuộc gọi đến (chưa dùng ở đây, nhưng cần có)
    userAgent.delegate = {
        onInvite(invitation) {
            console.log("📞 Nhận cuộc gọi đến:", invitation.request.to);
            session = invitation;

            session.accept().then(() => {
                const remoteStream = new MediaStream();
                const sdh = session.sessionDescriptionHandler;
                if (sdh && sdh.peerConnection) {
                    sdh.peerConnection.getReceivers().forEach((r) => {
                        if (r.track) remoteStream.addTrack(r.track);
                    });
                }
                remoteRef.current.srcObject = remoteStream;
            });
        },
    };

    // ✅ Bắt đầu khởi tạo UA
    await userAgent.start();

    // ✅ Đăng ký SIP (REGISTER)
    registerer = new Registerer(userAgent);
    await registerer.register();

    console.log("✅ SIP client đã đăng ký xong với Asterisk");
}

// 🧩 2️⃣ Tham gia phòng học (gọi đến conference bridge)
export async function joinConference(roomId, localRef, remoteRef, config) {
    if (!userAgent) throw new Error("SIP chưa khởi tạo");

    const target = `sip:conference-room_${roomId}@${config.domain}`;
    console.log("Gọi đến:", target);

    const targetURI = UserAgent.makeURI(target);

    // Lấy stream từ camera & micro
    const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    });
    localRef.current.srcObject = localStream;

    // Tạo Inviter (caller)
    const inviter = new Inviter(userAgent, targetURI, {
        sessionDescriptionHandlerOptions: {
            constraints: { audio: true, video: true },
        },
    });

    // Gắn stream local vào SDP
    inviter.sessionDescriptionHandlerFactoryOptions = {
        peerConnectionOptions: {
            rtcConfiguration: {
                iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
            },
        },
    };

    // Khi session được thiết lập (connected)
    inviter.stateChange.addListener((newState) => {
        if (newState === SessionState.Established) {
            console.log("Đã kết nối tới bridge room");
            const remoteStream = new MediaStream();
            const pc = inviter.sessionDescriptionHandler.peerConnection;
            pc.getReceivers().forEach((r) => {
                if (r.track) remoteStream.addTrack(r.track);
            });
            remoteRef.current.srcObject = remoteStream;
        }
    });

    // Thực hiện cuộc gọi (INVITE)
    await inviter.invite();

    session = inviter;
}

// 🧩 3️⃣ Rời phòng / kết thúc cuộc gọi
export async function hangUp() {
    try {
        if (session) {
            await session.dispose();
            console.log("Đã rời khỏi phòng học");
        }
        if (registerer) {
            await registerer.unregister();
            console.log("Đã hủy đăng ký SIP");
        }
        if (userAgent) {
            await userAgent.stop();
            console.log("🧹 Đã dọn dẹp SIP client");
        }
    } catch (err) {
        console.error("Lỗi khi ngắt kết nối:", err);
    }
}
