"use client"

import { useCollection } from 'react-firebase-hooks/firestore';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { NewDocumentButton } from "./new-document-button";
import { MenuIcon } from "lucide-react";
import { useUser } from '@clerk/nextjs';
import { collectionGroup, DocumentData, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect, useState } from 'react';
import { SidebarOption } from './sidebar-option';

interface RoomDocument extends DocumentData {
    createdAt: string;
    role: "owner" | "editor";
    roomId: string;
    userId: string;
}

export function Sidebar() {
    const { user } = useUser();
    const [groupedData, setGroupedData] = useState<{
        owner: RoomDocument[];
        editor: RoomDocument[];
    }>({ owner: [], editor: [] });

    const [data] = useCollection(
        user && (
            query(collectionGroup(db, 'rooms'), where('userId', '==', user.emailAddresses[0].toString()))
        )
    );

    useEffect(() => {
        if (!data) return;

        const grouped = data.docs.reduce<{
            owner: RoomDocument[];
            editor: RoomDocument[];
        }>((acc, doc) => {
            const roomData = doc.data() as RoomDocument;

            if (roomData.role === 'owner') {
                acc.owner.push({
                    id: doc.id,
                    ...roomData,
                });
            } else {
                acc.editor.push({
                    id: doc.id,
                    ...roomData,
                });
            }

            return acc;
        }, { owner: [], editor: [] })

        setGroupedData(grouped);
    }, [data])

    const menuOptions = (
        <>
            <NewDocumentButton />

            <div className="flex py-4 flex-col space-y-4 md:max-w-36">
                {groupedData.owner.length === 0 ? (
                    <h2 className="text-gray-500 font-semibold text-sm">
                        No documents found
                    </h2>
                ) : (
                    <>
                        <h2 className="text-gray-500 font-semibold text-sm">
                            My documents
                        </h2>

                        {groupedData.owner.map((doc) => (
                            <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
                        ))}
                    </>
                )}

                {groupedData.editor.length > 0 && (
                    <>
                        <h2 className="text-gray-500 font-semibold text-sm">
                            Shared with Me
                        </h2>

                        {groupedData.editor.map((doc) => (
                            <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
                        ))}
                    </>
                )}
            </div>
        </>
    )

    return (
        <aside className="p-2 md:p-5 bg-gray-200 relative">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon size={40} className="p-2 hover:opacity-30 rounded-lg" />
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                            <div>{menuOptions}</div>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="hidden md:inline">
                {menuOptions}
            </div>
        </aside>
    )
}