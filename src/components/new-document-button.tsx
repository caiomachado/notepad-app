"use client"

import { useTransition } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createNewDocument } from "../../actions/actions";

export function NewDocumentButton() {
    const [isCreatingDocument, startTransition] = useTransition();
    const router = useRouter();

    function handleCreateNewDocument() {
        startTransition(async () => {
            const { docId } = await createNewDocument();
            router.push(`/doc/${docId}`)
        })

    }

    return (
        <Button
            onClick={handleCreateNewDocument}
            disabled={isCreatingDocument}
        >
            {isCreatingDocument ? 'Creating...' : 'New Document'}
        </Button>
    )
}