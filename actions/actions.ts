"use server"

import { auth } from "@clerk/nextjs/server"
import { adminDb } from "../firebase-admin";
import { liveblocks } from "@/lib/liveblocks";
import { FieldValue } from "firebase-admin/firestore";

const dotReplacement = '%2E';

export async function createNewDocument() {
    await auth.protect();

    const { sessionClaims } = await auth();

    const documentCollectionReference = adminDb.collection("documents");
    const safeEmail = sessionClaims?.email?.replace(/\./g, dotReplacement) ?? '';
    const docRef = await documentCollectionReference.add({
        title: "New Doc",
        roomUsers: { [safeEmail]: 'owner' }
    })

    await adminDb.collection('users').doc(sessionClaims?.email ?? '').collection('rooms').doc(docRef.id).set({
        userId: sessionClaims?.email,
        role: 'owner',
        createdAt: new Date(),
        roomId: docRef.id,
    })

    return { docId: docRef.id }
}

export async function deleteDocument(roomId: string) {
    await auth.protect();

    try {
        await adminDb.collection('documents').doc(roomId).delete();

        const query = await adminDb.collectionGroup("rooms").where('roomId', '==', roomId).get();
        const batch = adminDb.batch();

        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        await liveblocks.deleteRoom(roomId);

        return { success: true }
    } catch (err) {
        console.log(err);
        return { success: false }
    }
}

export async function inviteUserToDocument(roomId: string, email: string) {
    auth.protect();

    try {
        await adminDb.collection('users').doc(email).collection('rooms').doc(roomId).set({
            userId: email,
            role: "editor",
            createdAt: new Date(),
            roomId,
        });

        const safeEmail = email.replace(/\./g, dotReplacement);
        await adminDb.collection('documents').doc(roomId).update({
            [`roomUsers.${safeEmail}`]: 'editor'
        })

        return { success: true }
    } catch (err) {
        console.log(err);
        return { success: false }
    }
}

export async function removeUserFromDocument(roomId: string, email: string) {
    auth.protect();

    try {
        await adminDb.collection('users').doc(email).collection('rooms').doc(roomId).delete();
        const safeEmail = email.replace(/\./g, dotReplacement);
        await adminDb.collection('documents').doc(roomId).update({
            [`roomUsers.${safeEmail}`]: FieldValue.delete()
        })

        return { success: true }
    } catch (err) {
        console.log(err);
        return { success: false }
    }
}
