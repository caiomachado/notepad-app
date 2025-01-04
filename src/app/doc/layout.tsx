import { LiveBlocksProvider } from "@/components/liveblocks-provider";
import { PropsWithChildren } from "react";

export default function DocLayout({ children }: PropsWithChildren) {
    return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
}