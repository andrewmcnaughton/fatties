import { useEffect } from 'react';
import { useUsersStore, useEntriesStore } from './store';
let init = false;

export function useAuth() {
    const verify = useUsersStore(state => state.verify);
    verify();
}

export function useDB() {
    const getEntries = useEntriesStore(state => state.getEntries);
    const subscribe = useEntriesStore(state => state.subscribe);

    getEntries();

    useEffect(() => {
        if (!init) {
            init = true;
            subscribe();
        }
    }, [subscribe]);
}
