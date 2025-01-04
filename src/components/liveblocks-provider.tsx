"use client";

import { PropsWithChildren } from "react";
import { LiveblocksProvider } from '@liveblocks/react/suspense';

export function LiveBlocksProvider({ children }: PropsWithChildren) {
    if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
        throw new Error("Missing NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY env variable");
    }

    return (
        <LiveblocksProvider throttle={16} authEndpoint={"/auth-endpoint"}>
            {children}
        </LiveblocksProvider>
    )
}