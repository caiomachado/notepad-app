"use client"

import { Document } from "@/components/document";
import { use } from "react";

type PageProps = {
    params: Promise<{ id: string }>
}

export default function DocumentPage({ params }: PageProps) {
    const { id } = use(params);

    return (
        <div className="flex flex-col flex-1 min-h-screen">
            <Document id={id} />
        </div>
    )
}