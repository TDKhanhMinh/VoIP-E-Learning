import { UserAgent, Registerer, Inviter, SessionState } from "sip.js";
const SIP_DOMAIN = import.meta.env.VITE_DOMAIN;
const SIP_WSS_URL = import.meta.env.VITE_WEBSOCKET_URL;


let incomingCallHandler = null;
export const setIncomingCallHandler = (handler) => {
    incomingCallHandler = handler;
};
const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    {
        urls: [
            "turn:webrtc.voipelearning.shop:3478?transport=udp",
            "turn:webrtc.voipelearning.shop:3478?transport=tcp",
            "turns:webrtc.voipelearning.shop:5349"
        ],
        username: "any",
        credential: "31a2313d897a7ca91b21486dac0c3184f7e3a673cacbe465b57687668fd8af43"
    }
];


export class SipClient {
    constructor({ sipId, sipPassword, displayName, onIncoming, onStateChange }) {
        this.sipId = sipId;
        this.sipPassword = sipPassword;
        this.displayName = displayName || sipId;
        this.onIncoming = onIncoming;
        this.onStateChange = onStateChange;
        this.ua = null;
        this.registerer = null;
        this.currentSession = null;
        this._audioEl = null;
    }

    setAudioElement(audioEl) {
        this._audioEl = audioEl;
    }

    async start() {
        const uri = UserAgent.makeURI(`sip:${this.sipId}@${SIP_DOMAIN}`);
        const uaOptions = {
            uri,
            authorizationUsername: this.sipId,
            authorizationPassword: this.sipPassword,
            displayName: this.displayName,
            transportOptions: {
                server: SIP_WSS_URL,
            },
            sessionDescriptionHandlerFactoryOptions: {
                peerConnectionConfiguration: {
                    iceServers: iceServers,
                },
            },
        };

        this.ua = new UserAgent(uaOptions);

        this.ua.delegate = {
            onInvite: (invitation) => {
                this._wireSession(invitation);
                this.onIncoming?.(invitation);
                if (incomingCallHandler) {
                    incomingCallHandler(invitation);
                }
            },
        };

        await this.ua.start();

        this.registerer = new Registerer(this.ua);
        await this.registerer.register();

        this.onStateChange?.({ registered: true });
    }

    async stop() {
        try {
            if (this.currentSession && this.currentSession.state !== SessionState.Terminated) {
                await this.currentSession?.bye?.();
            }
        } catch { console.warn("Error hanging up current session during stop"); }
        try { await this.registerer?.unregister(); } catch { console.warn("Error unregistering during stop"); }
        try { await this.ua?.stop(); } catch { console.warn("Error stopping UA during stop"); }
        this.onStateChange?.({ registered: false });
    }

    async call(targetSipId) {
        const targetUri = UserAgent.makeURI(`sip:${targetSipId}@${SIP_DOMAIN}`);
        const inviter = new Inviter(this.ua, targetUri, {
            sessionDescriptionHandlerOptions: {
                constraints: { audio: true, video: false },
            },
        });
        this._wireSession(inviter);
        await inviter.invite();
        return inviter;
    }

    async accept(invitation) {
        this._wireSession(invitation);
        await invitation.accept({
            sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } },
        });
    }

    async reject(invitation) {
        await invitation.reject();
    }

    async hangup() {
        if (!this.currentSession) return;
        try {
            if (this.currentSession.accept) {
                await this.currentSession.reject?.();
            } else {
                await this.currentSession.bye?.();
            }
        } finally {
            this.currentSession = null;
        }
    }

    _wireSession(session) {
        this.currentSession = session;

        session.stateChange.addListener((state) => {
            switch (state) {
                case SessionState.Establishing:
                    this.onStateChange?.({ sessionState: "calling" });
                    break;

                case SessionState.Established: {
                    this.onStateChange?.({ sessionState: "in-call" });
                    const sdh = session.sessionDescriptionHandler;
                    const pc = sdh?.peerConnection;
                    if (pc) {
                        const remoteStream = new MediaStream();
                        pc.getReceivers().forEach((r) => {
                            if (r.track?.kind === "audio") remoteStream.addTrack(r.track);
                        });
                        if (this._audioEl) {
                            this._audioEl.srcObject = remoteStream;
                            this._audioEl.play().catch(() => { });
                        }
                    }
                    break;
                }

                case SessionState.Terminated:
                    this.onStateChange?.({ sessionState: "idle" });
                    if (this._audioEl) this._audioEl.srcObject = null;
                    this.currentSession = null;
                    break;
            }
        });      
    }
}
