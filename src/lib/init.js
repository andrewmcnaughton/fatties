import { useStore } from '../store';
import { getSession, getGroup, getProfile, getEntries } from './api';

export async function init() {
    const session = await getSession();

    if (!session) {
        return null;
    }

    const profile = await getProfile(session);

    if (!profile) {
        return null;
    }

    const group = await getGroup(session);

    if (!group) {
        return null;
    }

    const entries = await getEntries(group);

    useStore.setState({
        init: true,
        session: session,
        group: group,
        profile: profile,
        entries: entries,
    });
}
