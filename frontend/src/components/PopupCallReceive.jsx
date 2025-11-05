import { useCallStore } from "../context/callStore";

const PopupCallReceive = () => {
    const { incomingCall, setIncomingCall } = useCallStore();

    if (!incomingCall) return null;

    const acceptCall = () => {
        incomingCall.accept();
        setIncomingCall(null);
    };

    const rejectCall = () => {
        incomingCall.reject();
        setIncomingCall(null);
    };

    return (
        <div className="fixed bottom-6 right-6 p-4 bg-white shadow-xl rounded-lg border z-50">
            <div className="text-lg font-semibold">Cuộc gọi đến</div>
            <div className="text-sm text-gray-600">
                {incomingCall.remoteIdentity.uri.toString()}
            </div>

            <div className="mt-3 flex gap-3">
                <button onClick={acceptCall} className="bg-green-500 text-white px-4 py-2 rounded">
                    Accept
                </button>
                <button onClick={rejectCall} className="bg-red-500 text-white px-4 py-2 rounded">
                    Reject
                </button>
            </div>
        </div>
    );
};

export default PopupCallReceive;
