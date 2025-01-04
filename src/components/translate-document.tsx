"use client";

import * as Y from 'yjs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { BotIcon, LanguagesIcon } from 'lucide-react';
import Markdown from 'react-markdown';

type Props = {
    doc: Y.Doc;
}

type Language = 'english' | 'portuguese' | 'spanish' | 'french' | 'italian' | 'german' | 'russian';

const languages: Language[] = [
    'english',
    'portuguese',
    'spanish',
    'french',
    'italian',
    'german',
    'russian'
];

export function TranslateDocument({ doc }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState('');
    const [summary, setSummary] = useState('');
    const [isPending, startTransition] = useTransition();

    async function handleAskQuestion(e: FormEvent) {
        e.preventDefault();

        startTransition(async () => {
            const documentData = doc.get('document-store').toJSON();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/translateDocument`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        documentData,
                        targetLang: language
                    })
                }
            );

            if (res.ok) {
                const { translated_text } = await res.json();
                setSummary(translated_text);
                toast.success("Translated summary successfully!");
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant="outline">
                <DialogTrigger>
                    <LanguagesIcon />
                    Translate
                </DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Translate the Document</DialogTitle>
                    <DialogDescription>
                        Select a language and AI will translate a summary of the document in the selected language.
                    </DialogDescription>
                </DialogHeader>

                {summary && (
                    <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
                        <div className="flex">
                            <BotIcon className="w-10 flex-shrink-0" />
                            <p className="font-bold">
                                GPT {isPending ? 'is thinking...' : 'says:'}
                            </p>
                        </div>
                        <p>{isPending ? 'Thinking...' : <Markdown>{summary}</Markdown>}</p>
                    </div>
                )}

                <form className="flex gap-2" onSubmit={handleAskQuestion}>
                    <Select
                        value={language}
                        onValueChange={setLanguage}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button type="submit" disabled={!language || isPending}>
                        {isPending ? 'Translating...' : 'Translate'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}