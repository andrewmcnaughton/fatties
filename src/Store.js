import { create } from 'zustand';
import { supabase } from './lib/api';

export const useEntriesStore = create((set, get) => ({
    entries: [],
    getEntries: async () => {
        if (useUsersStore.getState().user) {
            const { data } = await supabase
                .from('entries')
                .select()
                .eq('user_id', useUsersStore.getState().user.id)
                .order('id', { ascending: true });

            if (data) {
                set(state => ({ entries: data }));
            }
        }
    },
    subscribe: () => {
        const supaItems = supabase
            .channel('entries')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                },
                get().getEntries
            )
            .subscribe();
        return () => {
            supaItems.unsubscribe();
        };
    },
}));

export const useUsersStore = create((set, get) => ({
    user: false,
    verify: async () => {
        if (get().user) {
            return;
        }
        const { data, error } = await supabase.auth.getSession();

        if (data.session !== null) {
            set(state => ({ user: data.session.user }));
            if (error) {
                console.log(error);
            }
        } else {
            set(state => ({ user: false }));
        }
    },
    logout: async () => {
        await supabase.auth.signOut();
        set(state => ({ user: false }));
    },
}));
