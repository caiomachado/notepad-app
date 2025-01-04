"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { removeUserFromDocument } from "../../actions/actions";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useOwner } from "@/lib/useOwner";
import { useRoom } from "@liveblocks/react/suspense";
import { useUsersInRoom } from "@/lib/useUsersInRoom";

export function ManageUsers() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { user } = useUser();
    const room = useRoom();
    const isOwner = useOwner();
    const usersInRoom = useUsersInRoom();

    function handleDelete(userId: string) {
        startTransition(async () => {
            if (!user) return;

            const { success } = await removeUserFromDocument(room.id, userId);

            if (success) {
                toast.success('User removed from room successfully!');
            } else {
                toast.error('Failed to remove user from room!');
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant="outline">
                <DialogTrigger>Users ({usersInRoom?.docs?.length})</DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Users with Access</DialogTitle>
                    <DialogDescription>
                        Below is a list of users who have access to this document.
                    </DialogDescription>
                </DialogHeader>

                <hr className="my-2" />

                <ul className="flex flex-col space-y-2">
                    {usersInRoom?.docs?.map((doc) => {
                        const isCurrentIdOwner = doc.data().userId === user?.emailAddresses?.[0].toString();

                        return (
                            <li key={doc.data().userId} className="flex items-center justify-between">
                                <span className="font-light">
                                    {isCurrentIdOwner ? `You (${doc.data().userId})` : doc.data().userId}
                                </span>

                                <div className="flex items-center gap-2">
                                    <span>{doc.data().role}</span>
                                    {isOwner && !isCurrentIdOwner && (
                                        <Button
                                            onClick={() => handleDelete(doc.data().userId)}
                                            variant="destructive"
                                            size="sm"
                                            disabled={isPending}
                                        >
                                            {isPending ? 'Removing...' : 'X'}
                                        </Button>
                                    )}
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </DialogContent>
        </Dialog>
    )
}