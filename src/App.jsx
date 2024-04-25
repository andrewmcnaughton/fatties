import './App.css';
import { useUsersStore } from './store';
import { useDB, useAuth } from './hooks';
import Profile from './Profile';
import Chart from './Chart';
import ChartData from './ChartData';
import Habits from './Habits';
import Form from './Form';

function App() {
    useAuth();
    useDB();
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
