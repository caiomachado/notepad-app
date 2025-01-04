"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Editor } from "./editor";
import { useOwner } from "@/lib/useOwner";
import { DeleteDocument } from "./delete-document";
import { InviteUser } from "./invite-user";
import { ManageUsers } from "./manage-users";
import { Avatars } from "./avatars";

type Props = {
    id: string;
}

export function Document({ id }: Props) {
    const [data] = useDocumentData(doc(db, 'documents', id));
    const [inputValue, setInputValue] = useState('');
    const [isUpdating, startTransition] = useTransition();
    const isOwner = useOwner();

    function updateTitle(e: FormEvent) {
        e.preventDefault();

        if (inputValue.trim()) {
            startTransition(async () => {
                await updateDoc(doc(db, 'documents', id), {
                    title: inputValue
                });
            });
        }
    }

    useEffect(() => {
        if (data) {
            setInputValue(data.title);
        }
    }, [data]);

    return (
        <div className="flex-1 h-full bg-white p-5">
            <div className="flex max-w-6xl mx-auto justify-between pb-5">
                <form onSubmit={updateTitle} className="flex flex-1 space-x-2">
                    <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />

                    <Button disabled={isUpdating} type="submit">{isUpdating ? 'Updating...' : 'Update'}</Button>

                    {isOwner && (
                        <>
                            <InviteUser />
                            <DeleteDocument />
                        </>
                    )}
                </form>
            </div>

            <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
                <ManageUsers />
                <Avatars />
            </div>

            <hr className="pb-10" />

            <Editor />
        </div>
    )
}