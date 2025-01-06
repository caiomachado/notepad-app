import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../../firebase-admin";

export async function GET(req: NextRequest) {
    await auth.protect();

    const { sessionClaims } = await auth();
    const roomId = req.nextUrl.searchParams.get('roomId');

    const usersInRoom = await adminDb.collectionGroup('rooms').where('userId', '==', sessionClaims?.email).get();
    const userInRoom = usersInRoom.docs.find(doc => doc.id === roomId);

    if (!userInRoom?.exists) {
        return NextResponse.json(
            { message: 'You are not allowed in this room' },
            { status: 403 }
        )
    }

    return NextResponse.json({ isUserAllowedInRoom: true });
}