import { useEffect } from 'react';
import { useUsersStore, useEntriesStore } from './store';
import { useMemo } from 'react';
let init = false;

export function useAuth() {
    const user = useUsersStore(state => state.user);
    const verify = useUsersStore(state => state.verify);
    const getGroupMembers = useUsersStore(state => state.getGroupMembers);
    const group = useUsersStore(state => state.group);

    // const { user, verify, getGroupMembers } = useUsersStore(state => state);

    verify();
    useMemo(
        function () {
            getGroupMembers();
        },
        [user, getGroupMembers]
    );
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
