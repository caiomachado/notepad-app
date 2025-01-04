"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


export function Avatars() {
    const others = useOthers();
    const self = useSelf();

    const allAvatars = [self, ...others];

    return (
        <div className="flex gap-2 items-center">
            <p className="font-light text-sm">Users currently editing this page</p>

            <div className="flex -space-x-5">
                {allAvatars.map((user) => (
                    <TooltipProvider key={user?.info?.email}>
                        <Tooltip>
                            <TooltipTrigger>
                                <Avatar className="border-2 hover:z-50">
                                    <AvatarImage src={user?.info?.avatar} />
                                    <AvatarFallback>{user?.info?.name}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>{self?.id === user?.id ? 'You' : user?.info?.name}</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
        </div>
    )
}