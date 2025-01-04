import { collectionGroup, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";

export function useUsersInRoom() {
    const { user } = useUser();
    const room = useRoom();
    const [usersInRoom] = useCollection(
        user && query(collectionGroup(db, 'rooms'), where('roomId', '==', room.id))
    );

    return usersInRoom;
}