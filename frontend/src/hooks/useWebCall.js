import { useEffect, useMemo, useRef, useState } from "react";
import { SipClient } from "../services/sipClientService";

export function useWebCall({ sipId, sipPassword, displayName }) {
    const [registered, setRegistered] = useState(false);
    const [mode, setMode] = useState("idle");
    const [callee, setCallee] = useState(null);
    const [caller, setCaller] = useState(null);
    const audioRef = useRef();
    const incomingRef = useRef(null);
    const ringtone = useRef(new Audio("/sounds/ringtone.mp3"));
    const ringback = useRef(new Audio("/sounds/waittone.mp3"));

    ringtone.current.loop = true;
    ringback.current.loop = true;

    const client = useMemo(() => new SipClient({
        sipId, sipPassword, displayName,
        onIncoming: (invitation) => {
            incomingRef.current = invitation;
            setCaller(invitation.remoteIdentity.displayName || invitation.remoteIdentity.uri.user);
            ringtone.current.play();
            setMode("incoming");
        },
        onStateChange: ({ registered: r, sessionState }) => {
            if (typeof r === "boolean") setRegistered(r);
            if (sessionState === "calling") setMode("calling");
            if (sessionState === "in-call") setMode("in-call");
            if (sessionState === "idle") setMode("idle");

        },
    }), [sipId, sipPassword, displayName]);

    useEffect(() => {
        client.setAudioElement(audioRef.current);
        client.start();
        return () => client.stop();
    }, [client]);

    const startCall = async (targetSipId, label) => {
        setCallee(label || targetSipId);
        ringback.current.play();
        setMode("calling");
        await client.call(targetSipId);
    };

    const accept = async () => {
        if (incomingRef.current) {
            ringtone.current.pause();
            ringback.current.pause();
            await client.accept(incomingRef.current);
            setMode("in-call");

        }
    };
    const reject = async () => {
        if (incomingRef.current) {
            await client.reject(incomingRef.current);
            ringback.current.pause();
            ringtone.current.pause();
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
