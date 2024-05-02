import { create } from 'zustand';

export const useStore = create((set, get) => ({
    init: false,
    session: false,
    group: [],
    profile: false,
    entries: [],
    setEntries: newEntries => set(state => ({ entries: newEntries })),
    setProfile: newProfile => set(state => ({ profile: newProfile })),
    setGroup: newGroup => set(state => ({ group: newGroup })),
}));
