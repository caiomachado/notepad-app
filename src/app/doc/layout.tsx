import { LiveBlocksProvider } from "@/components/liveblocks-provider";
import { auth } from "@clerk/nextjs/server";
import { PropsWithChildren } from "react";

export default async function DocLayout({ children }: PropsWithChildren) {
    await auth.protect();

    return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
}