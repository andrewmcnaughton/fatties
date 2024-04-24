import { useEffect } from 'react';
import { useEntriesStore, useUsersStore } from './Store';
import { supabase } from './lib/api';

export default function useGetEntries() {
    const user = useUsersStore(state => state.user);

    useEffect(() => {
        getEntries();
        const supaItems = supabase
            .channel('entries')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                },
                getEntries
            )
            .subscribe();
        return () => {
            supaItems.unsubscribe();
        };
    }, [user, supabase]);

    async function getEntries() {
        // if user is false then dont do the fetch
        if (user) {
            const { data } = await supabase
                .from('entries')
                .select()
                .eq('user_id', user.id)
                .order('id', { ascending: true });

            if (data) {
                useEntriesStore.setState({ entries: data });
            }
        }
    }
}
