import { RoomProvider } from "@/components/room-provider";
import { auth } from "@clerk/nextjs/server"
import { PropsWithChildren } from "react";

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function RoomLayout({ children, params }: PropsWithChildren<Props>) {
    await auth.protect();
    const { id } = await params;

    return (
        <RoomProvider roomId={id}>
            {children}
        </RoomProvider>
    )
}