import './App.css';
import { useUsersStore } from './Store';
import useGetEntries from './useGetEntries';
import Profile from './Profile';
import Chart from './Chart';
import ChartData from './ChartData';
import Habits from './Habits';
import Form from './Form';
import useAuth from './useAuth.js';

function App() {
    useAuth();
    useGetEntries();
    const user = useUsersStore(state => state.user);

    return (
        <>
            <Profile />
            <h1 className="text-xl">Fatties Zustand</h1>
            <br />
            {user && <Chart />}
            {user && <ChartData />}
            {user && <Habits />}
            {user && <Form />}
        </>
    );
}

export default App;
