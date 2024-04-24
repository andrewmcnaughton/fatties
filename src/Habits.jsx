import { useEntriesStore } from './Store';
import { supabase } from './lib/api';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';

export default function OtherData() {
    const entries = useEntriesStore(state => state.entries);

    async function handleHabitChange(id, habit, value) {
        console.log(id, habit, value);
        const { data, error } = await supabase
            .from('entries')
            .update({
                [habit]: !value,
            })
            .eq('id', id)
            .select();
        if (error) console.log(error);
    }

    return (
        <div className="days track">
            <div className="day axis">
                <div className="header notshown"></div>
                <div className="diet">Diet</div>
                <div className="journal">Journal</div>
                <div className="study">Study</div>
            </div>
            {entries.map(function (entry, index) {
                return (
                    <div key={entry.id} className="day">
                        <div className="header">
                            Day {index}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Pencil className="h-5 w-5 -mt-14 ml-5" />
                                </PopoverTrigger>
                                <PopoverContent className="w-36 dark:bg-slate-800 text-white text-base">
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <strong>Day {index}</strong>
                                            <div className="flex mt-2 items-center mb-1">
                                                <Checkbox
                                                    id="diet"
                                                    checked={entry.diet}
                                                    onCheckedChange={() =>
                                                        handleHabitChange(
                                                            entry.id,
                                                            'diet',
                                                            entry.diet
                                                        )
                                                    }
                                                    className="mr-3 w-5 h-5 text-white accent-white border-white"
                                                />
                                                {/* <input
                                                        type="checkbox"
                                                        defaultChecked={
                                                            entry.diet
                                                        }
                                                        onChange={() =>
                                                            handleHabitChange(
                                                                index,
                                                                'diet'
                                                            )
                                                        }
                                                        id="diet"
                                                        className="mr-3 peer h-5 w-5 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                                    /> */}
                                                <Label
                                                    htmlFor="diet"
                                                    className="text-base"
                                                >
                                                    Diet
                                                </Label>
                                            </div>
                                            <div className="flex items-center mb-1">
                                                <Checkbox
                                                    id="journal"
                                                    checked={entry.journal}
                                                    onCheckedChange={() =>
                                                        handleHabitChange(
                                                            entry.id,
                                                            'journal',
                                                            entry.journal
                                                        )
                                                    }
                                                    className="mr-3 w-5 h-5 text-white accent-white border-white"
                                                />
                                                <Label
                                                    htmlFor="journal"
                                                    className="text-base"
                                                >
                                                    Journal
                                                </Label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox
                                                    id="study"
                                                    checked={entry.study}
                                                    onCheckedChange={() =>
                                                        handleHabitChange(
                                                            entry.id,
                                                            'study',
                                                            entry.study
                                                        )
                                                    }
                                                    className="mr-3 w-5 h-5 text-white accent-white border-white"
                                                />
                                                <Label
                                                    htmlFor="study"
                                                    className="text-base"
                                                >
                                                    Study
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="diet">
                            {!entry.diet ? (
                                <div className="false"></div>
                            ) : (
                                <div className="true"></div>
                            )}
                        </div>
                        <div className="journal">
                            {!entry.journal ? (
                                <div className="false"></div>
                            ) : (
                                <div className="true"></div>
                            )}
                        </div>

                        <div className="study">
                            {!entry.study ? (
                                <div className="false"></div>
                            ) : (
                                <div className="true"></div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
