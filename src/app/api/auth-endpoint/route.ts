import { liveblocks } from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    await auth.protect();

    const { sessionClaims } = await auth();
    const { room } = await req.json();

    const session = liveblocks.prepareSession(sessionClaims?.email ?? '', {
        userInfo: {
            name: sessionClaims?.fullName ?? '',
            email: sessionClaims?.email ?? '',
            avatar: sessionClaims?.image ?? '',
        }
    })

    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();

    return new Response(body, { status });
}