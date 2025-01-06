"use client"

import { useMyPresence, useOthers } from "@liveblocks/react";
import { PropsWithChildren, PointerEvent } from "react";
import { FollowPointer } from "./follow-pointer";

export function LiveCursorProvider({ children }: PropsWithChildren) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [myPresence, updateMyPresence] = useMyPresence();
    const others = useOthers();

    function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
        updateMyPresence({
            cursor: {
                x: Math.floor(e.pageX),
                y: Math.floor(e.pageY)
            }
        });
    }

    function handlePointerLeave() {
        updateMyPresence({
            cursor: null
        });
    }

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            {others.filter((other) => other.presence.cursor !== null).map(({ connectionId, info, presence }) => (
                <FollowPointer
                    key={connectionId}
                    info={info}
                    x={presence.cursor!.x}
                    y={presence.cursor!.y}
                />
            ))}

            {children}
        </div>
    )
}