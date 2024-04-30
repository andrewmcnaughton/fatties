import { useEntriesStore, useUsersStore } from './store';
import { supabase } from './lib/api';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';
import { Fragment } from 'react';

export default function OtherData() {
    const entries = useEntriesStore(state => state.entries);
    const { user: userStore, group } = useUsersStore(state => state);
    async function handleHabitChange(id, habit, value) {
        const { error } = await supabase
            .from('entries')
            .update({
                [habit]: !value,
            })
            .eq('id', id);
        if (error) console.log(error);
    }

    return entries.map(function (user) {
        return (
            <Fragment key={user[0]}>
                <div key={user[0]} className="days track">
                    <div className="day axis">
                        <div className="header notshown"></div>
                        <div className="diet">Diet</div>
                        <div className="journal">Journal</div>
                        <div className="study">Study</div>
                    </div>
                    {user[1].map(function (entry, index) {
                        return (
                            <div key={entry.id} className="day">
                                <div className="header">
                                    Day {index}
                                    {user[0] == userStore.id && (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Pencil className="h-5 w-5 -mt-14 ml-5" />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-36 dark:bg-slate-800 text-white text-base">
                                                <div className="grid gap-4">
                                                    <div className="grid gap-2">
                                                        <strong>
                                                            Day {index}
                                                        </strong>
                                                        <div className="flex mt-2 items-center mb-1">
                                                            <Checkbox
                                                                id="diet"
                                                                checked={
                                                                    entry.diet
                                                                }
                                                                onCheckedChange={() =>
                                                                    handleHabitChange(
                                                                        entry.id,
                                                                        'diet',
                                                                        entry.diet
                                                                    )
                                                                }
                                                                className="mr-3 w-5 h-5 text-white accent-white border-white"
                                                            />

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
                                                                checked={
                                                                    entry.journal
                                                                }
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
                                                                checked={
                                                                    entry.study
                                                                }
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
                                    )}
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
