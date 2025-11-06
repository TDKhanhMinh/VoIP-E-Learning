// import { useCallStore } from "../context/callStore";

// const PopupCallReceive = () => {
//     const { incomingCall, setIncomingCall } = useCallStore();

//     if (!incomingCall) return null;

//     const acceptCall = () => {
//         incomingCall.accept();
//         setIncomingCall(null);
//     };

//     const rejectCall = () => {
//         incomingCall.reject();
//         setIncomingCall(null);
//     };

//     return (
//         <div className="fixed bottom-6 right-6 p-4 bg-white shadow-xl rounded-lg border z-50">
//             <div className="text-lg font-semibold">Cuộc gọi đến</div>
//             <div className="text-sm text-gray-600">
//                 {incomingCall.remoteIdentity.uri.toString()}
//             </div>

//             <div className="mt-3 flex gap-3">
//                 <button onClick={acceptCall} className="bg-green-500 text-white px-4 py-2 rounded">
//                     Accept
//                 </button>
//                 <button onClick={rejectCall} className="bg-red-500 text-white px-4 py-2 rounded">
//                     Reject
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default PopupCallReceive;
export default function PopupCallReceive({ incomingCall, onAccept, onReject }) {
    if (!incomingCall) return null;

    const callerUri = incomingCall?.remoteIdentity?.uri?.toString() || "Unknown";
    const callerName = callerUri.split('@')[0].replace('sip:', '') || callerUri;

    return (
        <div className="fixed bottom-6 right-6 w-96 rounded-2xl shadow-2xl bg-white overflow-hidden transform transition-all duration-300 border border-gray-100 animate-[slideIn_0.3s_ease-out]">
            {/* Header with animated gradient */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-5 py-4 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

                <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                        <PhoneIncoming className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm font-medium opacity-90">Cuộc gọi đến</div>
                        <div className="text-lg font-bold">Incoming Call</div>
                    </div>
                </div>
            </div>

            {/* Caller Information */}
            <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center ring-4 ring-green-50">
                        <User className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <div className="text-lg font-semibold text-gray-900">{callerName}</div>
                        <div className="text-sm text-gray-500 break-all">{callerUri}</div>
                    </div>
                </div>

                {/* Animated sound waves */}
                <div className="mt-4 flex items-center justify-center gap-1">
                    <div className="w-1 bg-green-500 rounded-full animate-[wave_0.8s_ease-in-out_infinite] h-4"></div>
                    <div className="w-1 bg-green-500 rounded-full animate-[wave_0.8s_ease-in-out_0.1s_infinite] h-6"></div>
                    <div className="w-1 bg-green-500 rounded-full animate-[wave_0.8s_ease-in-out_0.2s_infinite] h-8"></div>
                    <div className="w-1 bg-green-500 rounded-full animate-[wave_0.8s_ease-in-out_0.3s_infinite] h-6"></div>
                    <div className="w-1 bg-green-500 rounded-full animate-[wave_0.8s_ease-in-out_0.4s_infinite] h-4"></div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
                <button
                    onClick={onReject}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-semibold text-red-600 shadow-sm group"
                >
                    <PhoneOff className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Reject
                </button>
                <button
                    onClick={onAccept}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-white font-semibold shadow-xl shadow-green-600/40 group"
                >
                    <Phone className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                    Accept
                </button>
            </div>
        </div>
    );
}