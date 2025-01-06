"use client";

import { PropsWithChildren, useEffect, useState, useTransition } from "react";
import { LiveblocksProvider } from '@liveblocks/react/suspense';
import { useParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "./loading-spinner";
import { toast } from "sonner";

export function LiveBlocksProvider({ children }: PropsWithChildren) {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [shouldDisplayProvider, setShouldDisplayProvider] = useState(false);
    const [isPending, startTransition] = useTransition();

    if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
        throw new Error("Missing NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY env variable");
    }

    useEffect(() => {
        function checkIfUserIsAllowed() {
            startTransition(async () => {
                const response = await fetch(`/api/allow-user-in-room?roomId=${id}`);
                const { isUserAllowedInRoom } = await response.json();

                if (isUserAllowedInRoom) {
                    setShouldDisplayProvider(true);
                } else {
                    router.replace('/');
                    toast.error('You are not allowed in this room or this room does not exist.')
                }
            })
        };

        checkIfUserIsAllowed();
    }, [id, router]);

    if (isPending) return <LoadingSpinner />;

    return shouldDisplayProvider ? (
        <LiveblocksProvider throttle={16} authEndpoint={"/api/auth-endpoint"}>
            {children}
        </LiveblocksProvider>
    ) : null;
}