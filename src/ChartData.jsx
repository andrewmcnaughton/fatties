import { useStore } from './store';
import { useState, Fragment } from 'react';
import { supabase } from './lib/api';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoaderCircle, Pencil, X } from 'lucide-react';

export default function ChartData() {
    const entries = useStore(state => state.entries);
    const profile = useStore(state => state.profile);
    const group = useStore(state => state.group);
    const [changedWeight, setChangedWeight] = useState(null);
    const [changedSteps, setChangedSteps] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleWeightChange(event) {
        setChangedWeight(event.target.value);
    }

    function handleStepsChange(event) {
        setChangedSteps(event.target.value);
    }

    async function handleChartDataFormSubmit(event, id, weight, steps) {
        setLoading(true);
        event.preventDefault();
        const { error } = await supabase
            .from('entries')
            .update({
                weight: changedWeight ? changedWeight : weight,
                steps: changedSteps ? changedSteps : steps,
            })
            .eq('id', id)
            .select();
        if (error) console.log(error);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }

    return entries.map(function (user) {
        return (
            <Fragment key={user[0]}>
                <div data-user={user[0]} className="days">
                    <br />
                    <div className="day axis">
                        <div className="header notshown"></div>
                        <div className="weight">Weight</div>
                        <div className="steps">Steps</div>
                    </div>
                    {user[1].map(function (entry, index) {
                        return (
                            <div
                                key={entry.id}
                                data-user={entry.id}
                                className="day"
                            >
                                <div className="header">
                                    Day {index}
                                    {user[0] == profile.id && (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Pencil className="h-5 w-5 -mt-14 ml-5" />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-48 dark:bg-slate-800 text-white text-base">
                                                <div className="grid gap-4">
                                                    <div className="grid gap-2">
                                                        <strong>
                                                            Day {index}
                                                        </strong>
                                                        <form
                                                            onSubmit={() =>
                                                                handleChartDataFormSubmit(
                                                                    event,
                                                                    entry.id,
                                                                    entry.weight,
                                                                    entry.steps
                                                                )
                                                            }
                                                        >
                                                            <div className="mt-1 grid grid-cols-2 items-center gap-2">
                                                                <Label
                                                                    htmlFor="weight"
                                                                    className="text-base"
                                                                >
                                                                    Weight
                                                                </Label>
                                                                <Input
                                                                    type="text"
                                                                    id="weight"
                                                                    defaultValue={
                                                                        entry.weight !==
                                                                            0 &&
                                                                        entry.weight
                                                                    }
                                                                    onChange={
                                                                        handleWeightChange
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="mt-1 grid grid-cols-2 items-center gap-2">
                                                                <Label
                                                                    htmlFor="steps"
                                                                    className="text-base"
                                                                >
                                                                    Steps
                                                                </Label>
                                                                <Input
                                                                    type="text"
                                                                    id="steps"
                                                                    defaultValue={
                                                                        entry.steps !==
                                                                            0 &&
                                                                        entry.steps
                                                                    }
                                                                    onChange={
                                                                        handleStepsChange
                                                                    }
                                                                />
                                                            </div>
                                                            {!loading && (
                                                                <Button
                                                                    type="submit"
                                                                    className="bg-white text-black mt-2 w-full mt-4 hover:bg-primary-foreground"
                                                                >
                                                                    Update
                                                                </Button>
                                                            )}
                                                            {loading && (
                                                                <Button
                                                                    disabled
                                                                    className="bg-white text-black mt-2 w-full mt-4"
                                                                >
                                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                                </Button>
                                                            )}
                                                        </form>
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </div>
                                <div className="weight">
                                    {entry.weight !== 0 && entry.weight}
                                </div>
                                <div className="steps">
                                    {entry.steps !== 0 && entry.steps}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <h4 className="mt-2 mb-10 text-left">
                    {group.map(function (groupmember) {
                        if (groupmember.id === user[0]) {
                            return groupmember.name;
                        }
                    })}
                </h4>
            </Fragment>
        );
    });
}
