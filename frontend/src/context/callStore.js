import { create } from "zustand";

export const useCallStore = create((set) => ({
    incomingCall: null,
    setIncomingCall: (call) => set({ incomingCall: call }),
}));
