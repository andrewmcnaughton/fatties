import { useEffect } from 'react';
import { supabase } from './lib/api';
import { useUsersStore } from './Store';

export default function useAuth() {
    const user = useUsersStore(state => state.user);

    useEffect(() => {
        verify();
    }, [user]);

    async function verify() {
        if (user) {
            return;
        }
        const { data, error } = await supabase.auth.getSession();

        if (data.session !== null) {
            useUsersStore.setState({ user: data.session.user });
            if (error) {
                console.log(error);
            }
        } else {
            useUsersStore.setState({ user: false });
        }
    }

    async function logout() {
        await supabase.auth.signOut();
        useUsersStore.setState({ user: false });
    }

    return { logout: logout };
}
