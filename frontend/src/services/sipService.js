// src/services/sipService.js
import { UserAgent, Inviter, Registerer } from "sip.js";

let ua, registerer, currentSession;

/**
 * Khởi tạo SIP kết nối đến Asterisk
 */
export async function initSip(config, localRef, remoteRef) {
    ua = new UserAgent({
        uri: UserAgent.makeURI(`sip:${config.username}@${config.domain}`),
        transportOptions: { server: config.wsServer },
        authorizationUsername: config.username,
        authorizationPassword: config.password,
        sessionDescriptionHandlerFactoryOptions: {
            constraints: { audio: true, video: true },
        },
    });

    registerer = new Registerer(ua);
    await ua.start();
    await registerer.register();

    // Khi nhận cuộc gọi đến
    ua.delegate = {
        onInvite: async (invitation) => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            if (localRef.current) localRef.current.srcObject = stream;

            const pc = invitation.sessionDescriptionHandler.peerConnection;
            stream.getTracks().forEach((t) => pc.addTrack(t, stream));

            invitation.stateChange.addListener((state) => {
                if (state === "Established") {
                    const remoteStream = invitation.sessionDescriptionHandler.remoteMediaStream;
                    if (remoteRef.current) remoteRef.current.srcObject = remoteStream;
                }
            });

            await invitation.accept();
        },
    };

    console.log("✅ SIP user registered:", config.username);
}

/**
 * Bắt đầu gọi đến 1 user khác
 */
export async function startCall(target, localRef, remoteRef) {
    if (!ua) throw new Error("SIP not initialized");
    const inviter = new Inviter(ua, `sip:${target}`);
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });
    if (localRef.current) localRef.current.srcObject = stream;

    const pc = inviter.sessionDescriptionHandler.peerConnection;
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    inviter.stateChange.addListener((state) => {
        if (state === "Established") {
            const remoteStream = inviter.sessionDescriptionHandler.remoteMediaStream;
            if (remoteRef.current) remoteRef.current.srcObject = remoteStream;
        }
    });

    await inviter.invite();
    currentSession = inviter;
}

/**
 * Kết thúc cuộc gọi
 */
export function hangUp() {
    if (currentSession) {
        currentSession.bye();
        currentSession = null;
    }
}
