"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useUsersInRoom } from "./useUsersInRoom";

export function useOwner() {
    const { user } = useUser();
    const [isOwner, setIsOwner] = useState(false);
    const usersInRoom = useUsersInRoom();

    useEffect(() => {
        if (usersInRoom?.docs && usersInRoom.docs.length > 0) {
            const owners = usersInRoom.docs.filter((doc) => doc.data().role === 'owner');

            if (
                owners.some(
                    (owner) => owner.data().userId === user?.emailAddresses[0].toString()
                )
            ) {
                setIsOwner(true);
            }
        }
    }, [usersInRoom, user])

    return isOwner;
}