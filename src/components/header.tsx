"use client"

import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
    useUser
} from '@clerk/nextjs'
import { Breadcrumbs } from './breadcrumbs';

export function Header() {
    const { user } = useUser();

    return (
        <header className="flex items-center justify-between p-5">
            {user && (
                <h1 className="text-2xl">
                    {user?.firstName}{"'s"} space
                </h1>
            )}

            <Breadcrumbs />


            <div>
                <SignedIn>
                    <UserButton />
                </SignedIn>

                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </div>
        </header>
    )
};