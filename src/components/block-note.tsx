import * as Y from 'yjs';
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { BlockNoteView } from '@blocknote/shadcn';
import { BlockNoteEditor } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { useSelf } from '@liveblocks/react';
import { stringToColor } from '@/lib/stringToColor';

type Props = {
    doc: Y.Doc;
    provider: LiveblocksYjsProvider;
    darkMode: boolean;
}

export function BlockNote({ doc, provider, darkMode }: Props) {
    const userInfo = useSelf((self) => self.info);
    const editor: BlockNoteEditor = useCreateBlockNote({
        collaboration: {
            provider,
            fragment: doc.getXmlFragment('document-store'),
            user: {
                name: userInfo?.name ?? 'Anonymous',
                color: stringToColor(userInfo?.email ?? ''),
            }
        }
    });

    return (
        <div className="relative max-w-6xl mx-auto">
            <BlockNoteView
                className="min-h-screen"
                editor={editor}
                theme={darkMode ? 'dark' : 'light'}
            />
        </div>
    )
}