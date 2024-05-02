import Profile from './Profile';
import { init } from './lib/init';
import './App.css';
import { useStore } from './store';
import Habits from './Habits';
import ChartData from './ChartData';
import Chart from './Chart';
import Form from './Form';
import { useEffect } from 'react';
import { supabase, getEntries } from './lib/api';
init();
function App() {
    const session = useStore(state => state.session);
    const group = useStore(state => state.group);
    const init = useStore(state => state.init);
    const setEntries = useStore(state => state.setEntries);

    const handleEdits = async function () {
        const entries = await getEntries(group);
        setEntries(entries);
    };

    useEffect(() => {
        const supaItems = supabase
            .channel('entries')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                },
                handleEdits
            )
            .subscribe();
        return () => {
            supaItems.unsubscribe();
        };
    }, [init, supabase]);

    return (
        <>
            <Profile />
            <h1 className="text-xl">Fatties</h1>
            <br />
            {session && <Chart />}
            {session && <ChartData />}
            {session && <Habits />}
            {session && <Form />}
        </>
    );
}

export default App;
