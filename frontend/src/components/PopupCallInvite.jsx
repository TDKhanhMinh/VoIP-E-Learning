
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

    return (
        <div className="fixed bottom-4 right-4 w-80 rounded-xl shadow-xl bg-white ring-1 ring-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b font-medium"><Title /></div>

            <div className="p-4 space-y-2 text-sm text-gray-600">
                {mode === "calling" && <div>Đang thiết lập kết nối…</div>}
                {mode === "incoming" && <div>Chấp nhận hay từ chối cuộc gọi?</div>}
                {mode === "in-call" && <div>Đang kết nối… nói đi thôi 🎧</div>}
            </div>

            <div className="p-3 flex items-center gap-2 justify-end border-t">
                {mode === "incoming" && (
                    <>
                        <button onClick={onReject} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Từ chối</button>
                        <button onClick={onAccept} className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Chấp nhận</button>
                    </>
                )}
                {mode === "calling" && (
                    <button onClick={onHangup} className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Hủy</button>
                )}
                {mode === "in-call" && (
                    <button onClick={onHangup} className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Kết thúc</button>
                )}
                {mode === "idle" && (
                    <button onClick={onClose} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Đóng</button>
                )}
            </div>
        </div>
    );
}
