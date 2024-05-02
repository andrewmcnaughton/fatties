import { useStore } from '../store';
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
    'https://aktjwoonwpdssbkjerge.supabase.co',
    import.meta.env.VITE_SUPABASETOKEN
);

export async function getSession() {
    const { data: session, error } = await supabase.auth.getSession();

    if (error) {
        console.log(error);
        return null;
    }

    if (!session) {
        console.log('no session');
        return null;
    }

    return session.session.user;
}

export async function getGroup(session) {
    const { data: groupMember } = await supabase
        .from('users')
        .select()
        .eq('id', session.id);

    const { data: groupMembers } = await supabase
        .from('users')
        .select()
        .eq('group', groupMember[0].group);

    return groupMembers;
}

export async function getProfile(session) {
    const { data: profile } = await supabase
        .from('users')
        .select()
        .single()
        .eq('id', session.id);

    return profile;
}

export async function getEntries(groupMembers) {
    const { data: entries } = await supabase
        .from('entries')
        .select()
        .in(
            'user_id',
            groupMembers.map(member => member.id)
        )
        .order('id', { ascending: true });

    if (!entries) {
        return [];
    }

    const grouped = Object.groupBy(entries, ({ user_id }) => user_id);
    const groupedArray = Object.entries(grouped);
    return groupedArray;
}

export async function logout() {
    await supabase.auth.signOut();
    useStore.setState({ session: false });
}
