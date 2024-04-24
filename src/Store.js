import { create } from 'zustand';

export const useEntriesStore = create(set => ({
    entries: [],
}));

export const useUsersStore = create(set => ({
    user: false,
}));
