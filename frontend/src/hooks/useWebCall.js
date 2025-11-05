// src/voip/useWebCall.js
import { useEffect, useMemo, useRef, useState } from "react";
import { SipClient } from "../services/sipClientService";

export function useWebCall({ sipId, sipPassword, displayName }) {
    const [registered, setRegistered] = useState(false);
    const [mode, setMode] = useState("idle"); // idle | calling | incoming | in-call
    const [callee, setCallee] = useState(null);
    const [caller, setCaller] = useState(null);
    const audioRef = useRef();
    const incomingRef = useRef(null);

    const client = useMemo(() => new SipClient({
        sipId, sipPassword, displayName,
        onIncoming: (invitation) => {
            incomingRef.current = invitation;
            setCaller(invitation.remoteIdentity.displayName || invitation.remoteIdentity.uri.user);
            setMode("incoming");
        },
        onStateChange: ({ registered: r, sessionState }) => {
            if (typeof r === "boolean") setRegistered(r);
            if (sessionState === 1) setMode("calling");     // Establishing
            if (sessionState === 2) setMode("in-call");     // Established
            if (sessionState === 3) setMode("idle");        // Terminated
        },
    }), [sipId, sipPassword, displayName]);

    useEffect(() => {
        client.setAudioElement(audioRef.current);
        client.start();
        return () => client.stop();
        // eslint-disable-next-line
    }, [client]);

    const startCall = async (targetSipId, label) => {
        setCallee(label || targetSipId);
        setMode("calling");
        await client.call(targetSipId);
    };

    const accept = async () => {
        if (incomingRef.current) {
            await client.accept(incomingRef.current);
            setMode("in-call");
        }
    };
    const reject = async () => {
        if (incomingRef.current) {
            await client.reject(incomingRef.current);
            incomingRef.current = null;
            setMode("idle");
        }
    };
    const hangup = async () => {
        await client.hangup();
        setMode("idle");
    };

    return {
        registered,
        mode,
        callee,
        caller,
        audioRef,
        actions: { startCall, accept, reject, hangup },
    };
}
