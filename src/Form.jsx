import { useState } from 'react';
import { supabase } from './lib/api';
import { useStore } from './store';

export default function Form() {
    const session = useStore(state => state.session);
    const [weight, setWeight] = useState(0);
    const [steps, setSteps] = useState(0);
    const [diet, setDiet] = useState(false);
    const [journal, setJournal] = useState(false);
    const [study, setStudy] = useState(false);
    function getDate() {
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        return today.toDateString();
    }
    const date = getDate();

    function handleWeightChange(event) {
        setWeight(event.target.value);
    }

    function handleStepsChange(event) {
        setSteps(event.target.value);
    }

    function handleDietChange(event) {
        setDiet(event.target.checked);
    }

    function handleJournalChange(event) {
        setJournal(event.target.checked);
    }

    function handleStudyChange(event) {
        setStudy(event.target.checked);
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        const { error } = await supabase
            .from('entries')
            .insert({
                date: date,
                user_id: session.id,
                weight: weight,
                steps: steps,
                diet: diet,
                journal: journal,
                study: study,
            })
            .single();
        if (error) console.log(error);
    }

    return (
        <form className="form-daily" onSubmit={handleFormSubmit}>
            <label htmlFor="daily-weight">Weight: </label>
            <input
                type="text"
                value={weight || ''}
                onChange={handleWeightChange}
                placeholder="weight"
                id="daily-weight"
            />
            <br />
            <label htmlFor="daily-steps">Steps: </label>
            <input
                type="text"
                value={steps || ''}
                onChange={handleStepsChange}
                placeholder="steps"
                id="daily-steps"
            />
            <br />
            <label htmlFor="daily-diet">Diet: </label>
            <input
                type="checkbox"
                checked={diet}
                onChange={handleDietChange}
                id="daily-diet"
            />
            <br />
            <label htmlFor="daily-journal">Journal: </label>
            <input
                type="checkbox"
                checked={journal}
                onChange={handleJournalChange}
                id="daily-journal"
            />
            <br />
            <label htmlFor="daily-study">Study: </label>
            <input
                type="checkbox"
                checked={study}
                onChange={handleStudyChange}
                id="daily-study"
            />
            <br />
            <input type="submit" />
        </form>
    );
}
