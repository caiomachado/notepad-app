"use client";

import { ClientSideSuspense, RoomProvider as RoomProviderWrapper } from "@liveblocks/react/suspense";
import { PropsWithChildren } from "react";
import { LoadingSpinner } from "./loading-spinner";
import { LiveCursorProvider } from "./live-cursor-provider";

type Props = {
    roomId: string;
}

export function RoomProvider({ children, roomId }: PropsWithChildren<Props>) {
    return (
        <RoomProviderWrapper
            id={roomId}
            initialPresence={{
                cursor: null
            }}
        >
            <ClientSideSuspense fallback={<LoadingSpinner />}>
                <LiveCursorProvider>{children}</LiveCursorProvider>
            </ClientSideSuspense>
        </RoomProviderWrapper>
    )
}