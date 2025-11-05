import { useEffect, useState } from "react";
import { useWebCall } from "../hooks/useWebCall";
import { voipService } from "../services/voipService";
import PopupCallInvite from "./PopupCallInvite";
import { FaPhone } from "react-icons/fa";
export default function MessageCall({ target }) {
    const targetSip = target.email.split("@")[0];
    const userId = sessionStorage.getItem("userId")?.replace(/"/g, "");
    const userPassword = sessionStorage.getItem("password")?.replace(/"/g, "");
    const [sipUser, setSipUser] = useState(null);

    useEffect(() => {
        const loadSipCreds = async () => {
            try {
                const data = await voipService.getMySipCredentials(userId);
                console.log("Credentials SIP:", data);
                setSipUser(data);
            } catch (err) {
                console.warn("Không thể lấy SIP Credentials:", err.message);
            }
        };
        loadSipCreds();
    }, []);

    const { registered, mode, callee, caller, audioRef, actions } = useWebCall({
        sipId: sipUser?.sipId,
        sipPassword: userPassword,
        displayName: sipUser?.full_name,
    });

    return (
        <>
            {/* Âm thanh cuộc gọi */}
            <audio ref={audioRef} autoPlay hidden />

            {/* ✅ Nút nổi góc phải */}
            <button
                disabled={!registered}
                onClick={() => actions.startCall(targetSip, target?.name || targetSip)}
                title={registered ? `Gọi ${target?.name || targetSip}` : "Đang kết nối SIP..."}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl transition transform hover:scale-110
                    ${registered ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}
                `}
            >
                <FaPhone size={24} />
            </button>

            {/* ✅ Popup nhận/gọi cuộc gọi */}
            <PopupCallInvite
                visible={mode !== "idle"}
                mode={mode}
                calleeLabel={callee}
                callerLabel={caller}
                onAccept={actions.accept}
                onReject={actions.reject}
                onHangup={actions.hangup}
                onClose={actions.hangup}
            />
        </>
    );
}
