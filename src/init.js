// Create an init function, that collects all necessary data before first render. Use this to fill a singular store.
// -Extra all the API calls, putin api.js, functions take paramters that we can pass in later
// - user if available
// 	- if not, loggedout state
// - group data
// - entries data
import { create } from 'zustand';
import { supabase } from './lib/api';

// Not to be in the init: Subscribe
let payload = {};

export async function init() {
    // USER
    console.log('getAuthSession start');

    const { data: session, error } = await supabase.auth.getSession();

    let user = null;

    if (session.session !== null) {
        //set(state => ({ user: data.session.user }));
        user = session.session.user;
        payload = { ...init, user: user };
        console.log('getAuthSession:', user);

        if (error) {
            console.log(error);
        }
    } else {
        console.log('getAuthSession: failed');
        //set(state => ({ user: false }));
    }

    console.log('getAuthSession finished');
    console.log('getGroup start');

    const { data: groupMember } = await supabase
        .from('users')
        .select()
        .eq('id', user.id);

    console.log('getUserfromUsers:', groupMember);

    const { data: groupMembers } = await supabase
        .from('users')
        .select()
        .eq('group', groupMember[0].group);

    console.log('getUsersInGroup:', groupMembers);

    payload = { ...init, group: groupMembers };

    //set(state => ({ group: groupMembers }));
    console.log('getGroup finished');

    console.log('getEntriesOfGroup start');
    const { data: entries } = await supabase
        .from('entries')
        .select()
        .in(
            'user_id',
            groupMembers.map(member => member.id)
        );
    console.log('getEntriesOfGroup:', entries);

    if (entries) {
        const grouped = Object.groupBy(entries, ({ user_id }) => user_id);
        const groupedArray = Object.entries(grouped);
        //set(state => ({ entries: groupedArray }));
        console.log('EntriesGrouped:', groupedArray);
        payload = { ...init, entries: groupedArray };
    }

    return payload;
}
