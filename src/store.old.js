import { create } from 'zustand';
import { supabase } from './lib/api';

export const useEntriesStore = create((set, get) => ({
    entries: [],
    getEntries: async () => {
        if (useUsersStore.getState().group) {
            const { data } = await supabase
                .from('entries')
                .select()
                .in(
                    'user_id',
                    useUsersStore.getState().group.map(member => member.id)
                )
                .order('id', { ascending: true });

            if (data) {
                const grouped = Object.groupBy(data, ({ user_id }) => user_id);
                const groupedArray = Object.entries(grouped);
                set(state => ({ entries: groupedArray }));
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
    group: false,
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
    getGroupMembers: async () => {
        if (get().user) {
            const { data: groupMember } = await supabase
                .from('users')
                .select()
                .eq('id', get().user.id);

            const { data: groupMembers } = await supabase
                .from('users')
                .select()
                .eq('group', groupMember[0].group);

            set(state => ({ group: groupMembers }));
        }
    },
}));
