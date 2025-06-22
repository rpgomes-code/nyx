'use client';

import { trpc } from '@/lib/trpc-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { toast } from 'sonner';

export function UserProfile() {
    const { data: profile, isLoading, refetch } = trpc.user.getProfile.useQuery();
    const updateProfile = trpc.user.updateProfile.useMutation({
        onSuccess: () => {
            toast.success('Profile updated successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const [name, setName] = useState('');

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!profile) {
        return <div>Profile not found</div>;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile.mutate({ name });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            disabled
                        />
                    </div>
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name || profile.name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={updateProfile.isPending}
                    >
                        {updateProfile.isPending ? 'Updating...' : 'Update Profile'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}