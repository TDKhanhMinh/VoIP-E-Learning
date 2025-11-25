import React, { useEffect, useState } from "react";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { useRoomContext } from "@livekit/components-react";
import { RoomEvent, DataPacket_Kind } from "livekit-client";

export default function WhiteboardTldraw() {
    const [editor, setEditor] = useState(null);
    const room = useRoomContext();

    useEffect(() => {
        if (!editor || !room) return;

        const cleanupListener = editor.store.listen((entry) => {
            if (entry.source !== "user") return;

            const { changes } = entry;

            const strData = JSON.stringify(changes);
            const data = new TextEncoder().encode(strData);

            room.localParticipant.publishData(data, {
                reliable: true,
                topic: "whiteboard",
            });
        });

        return () => {
            cleanupListener();
        };
    }, [editor, room]);

    useEffect(() => {
        if (!editor || !room) return;

        const handleDataReceived = (payload, participant, kind, topic) => {
            if (topic !== "whiteboard") return;

            try {
                const strData = new TextDecoder().decode(payload);
                const changes = JSON.parse(strData);

                editor.store.mergeRemoteChanges(() => {
                    const { added, updated, removed } = changes;

                    if (Object.keys(added).length > 0) editor.store.put(Object.values(added));
                    if (Object.keys(updated).length > 0) editor.store.put(Object.values(updated));
                    if (Object.keys(removed).length > 0) editor.store.remove(Object.keys(removed));
                });
            } catch (error) {
                console.error("Lỗi parse data whiteboard:", error);
            }
        };

        room.on(RoomEvent.DataReceived, handleDataReceived);

        return () => {
            room.off(RoomEvent.DataReceived, handleDataReceived);
        };
    }, [editor, room]);

    return (
        <div style={{ height: "100%", width: "100%", background: "#fff" }}>
            <Tldraw
                licenseKey="tldraw-2026-03-04/WyJhQjNRbDRRaSIsWyIqIl0sMTYsIjIwMjYtMDMtMDQiXQ.61i4er85gOY2zy0M527utDYltSDV6TGrla2jB2u0DvptPHRRLwOgWddzx6eWQ/sQwcoP7zQ0VIG35ZR3yGkc8A"
                onMount={(editorInstance) => setEditor(editorInstance)}
            />
        </div>
    );
}