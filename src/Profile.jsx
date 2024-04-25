import { useEffect, useState } from 'react';
import { supabase } from './lib/api';
import { useUsersStore } from './store';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleUserRound, LogOut, LoaderCircle } from 'lucide-react';

export default function Profile() {
    const user = useUsersStore(state => state.user);
    const logout = useUsersStore(state => state.logout);
    const [name, setName] = useState('');
    const [startWeight, setStartWeight] = useState('');
    const [goalWeight, setGoalWeight] = useState('');
    const [group, setGroup] = useState('');
    const [profile, setProfile] = useState({});
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProfile();
    }, [user]);

    async function getProfile() {
        // if user is false then dont do the fetch
        if (user) {
            const { data } = await supabase
                .from('users')
                .select()
                .eq('id', user.id);

            if (data) {
                const { name, start_weight, goal_weight, group } = data[0];
                setProfile(data[0]);
                setName(name);
                setStartWeight(start_weight);
                setGoalWeight(goal_weight);
                setGroup(group);
            }
        }
    }

    function handleNameChange(event) {
        setName(event.target.value);
    }

    function handleStartWeightChange(event) {
        setStartWeight(event.target.value);
    }

    function handleGoalWeightChange(event) {
        setGoalWeight(event.target.value);
    }

    function handleGroupChange(event) {
        setGroup(event.target.value);
    }

    async function handleProfileFormSubmit(event) {
        setLoading(true);
        event.preventDefault();
        const { data, error } = await supabase
            .from('users')
            .update({
                name: name,
                start_weight: startWeight,
                goal_weight: goalWeight,
                group: group,
            })
            .eq('id', profile.id)
            .select();
        if (error) console.log(error);
        setTimeout(() => {
            setOpen(false);
            setLoading(false);
        }, 500);
        console.log(data);
    }

    return (
        <div className="profile">
            {!user && (
                <Auth
                    supabaseClient={supabase}
                    appearance={{
                        theme: ThemeSupa,
                    }}
                    providers={['google']}
                    onlyThirdPartyProviders
                />
            )}
            {user && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost">
                            <CircleUserRound className="h-7 w-7 profile-icon" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-80">
                        <DialogHeader>
                            <DialogTitle>Update your profile</DialogTitle>
                            {/* <DialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </DialogDescription> */}
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <form
                                    className="form-profile"
                                    onSubmit={handleProfileFormSubmit}
                                >
                                    <Label
                                        htmlFor="displayName"
                                        className="mt-4"
                                    >
                                        Display Name
                                    </Label>
                                    <Input
                                        id="displayName"
                                        value={name}
                                        onChange={handleNameChange}
                                        className="mb-4"
                                    />
                                    <Label
                                        htmlFor="startWeight"
                                        className="mt-4"
                                    >
                                        Start Weight
                                    </Label>
                                    <Input
                                        id="startWeight"
                                        value={startWeight}
                                        onChange={handleStartWeightChange}
                                        className="mb-4"
                                    />
                                    <Label
                                        htmlFor="goalWeight"
                                        className="mt-4"
                                    >
                                        Goal Weight
                                    </Label>
                                    <Input
                                        id="goalWeight"
                                        value={goalWeight}
                                        onChange={handleGoalWeightChange}
                                        className="mb-4"
                                    />
                                    <Label htmlFor="groupId">Group ID</Label>
                                    <Input
                                        id="groupId"
                                        value={group}
                                        onChange={handleGroupChange}
                                        className="mb-2"
                                    />
                                    {!loading && (
                                        <Button
                                            type="submit"
                                            className="mt-3 w-full"
                                        >
                                            Save
                                        </Button>
                                    )}
                                    {loading && (
                                        <Button
                                            disabled
                                            className="mt-3 w-full"
                                        >
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            Saving
                                        </Button>
                                    )}
                                </form>
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-center">
                            <Button variant="outline" onClick={logout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Signout
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
