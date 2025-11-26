import { Phone, PhoneIncoming, PhoneOff, X, User } from 'lucide-react';

export default function PopupCallInvite({
    visible,
    mode,
    calleeLabel,
    callerLabel,
    onAccept,
    onReject,
    onHangup,
    onClose,
}) {
    if (!visible) return null;

    const Title = () => {
        switch (mode) {
            case "calling": return <>Đang gọi <b>{calleeLabel}</b>…</>;
            case "incoming": return <><b>{callerLabel}</b> đang gọi…</>;
            case "in-call": return <>Đang nói chuyện với <b>{calleeLabel || callerLabel}</b></>;
            default: return <>Gọi trực tiếp</>;
        }
    };

    const getStatusColor = () => {
        switch (mode) {
            case "calling": return "bg-blue-500";
            case "incoming": return "bg-green-500";
            case "in-call": return "bg-emerald-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <div className="fixed bottom-6 right-6 w-96 rounded-2xl shadow-2xl bg-white overflow-hidden transform transition-all duration-300 border border-gray-100">
            <div className={`${getStatusColor()} px-5 py-4 text-white relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            {mode === "incoming" ? (
                                <PhoneIncoming className="w-5 h-5" />
                            ) : (
                                <Phone className="w-5 h-5" />
                            )}
                        </div>
                        <div className="font-semibold text-lg"><Title /></div>
                    </div>
                    {mode === "in-call" && (
                        <div className="flex items-center gap-1.5 animate-pulse">
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-5 bg-gradient-to-b from-gray-50 to-white">
                <div className="flex items-center gap-3 text-gray-600">
                    <div className={`w-1.5 h-1.5 rounded-full ${mode === "in-call" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
                    <div className="text-sm">
                        {mode === "calling" && "Đang thiết lập kết nối…"}
                        {mode === "incoming" && "Chấp nhận hay từ chối cuộc gọi?"}
                        {mode === "in-call" && "Kết nối thành công. Bạn đang trong cuộc gọi."}
                    </div>
                </div>
            </div>

            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3 justify-end">
                {mode === "incoming" && (
                    <>
                        <button
                            onClick={onReject}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-gray-700 shadow-sm"
                        >
                            <PhoneOff className="w-4 h-4" />
                            Từ chối
                        </button>
                        <button
                            onClick={onAccept}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 transition-all duration-200 text-white font-medium shadow-lg shadow-green-600/30"
                        >
                            <Phone className="w-4 h-4" />
                            Chấp nhận
                        </button>
                    </>
                )}
                {mode === "calling" && (
                    <button
                        onClick={onHangup}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-200 text-white font-medium shadow-lg shadow-red-600/30"
                    >
                        <PhoneOff className="w-4 h-4" />
                        Hủy
                    </button>
                )}
                {mode === "in-call" && (
                    <>
                        <button button
                            onClick={onHangup}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-200 text-white font-medium shadow-lg shadow-red-600/30"
                        >
                            <PhoneOff className="w-4 h-4" />
                            Kết thúc
                        </button>
                    </>
                )}
                {mode === "idle" && (
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-gray-700 shadow-sm"
                    >
                        <X className="w-4 h-4" />
                        Đóng
                    </button>
                )}
            </div>
        </div >
    );
}