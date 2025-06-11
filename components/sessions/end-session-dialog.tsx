"use client";

import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function EndSessionDialog({ sessionId, onSubmit }: { sessionId: string, onSubmit: () => void }) {
    const router = useRouter();
    const [error, setError] = useState("");

    async function handleSubmit(formData: FormData) {
        const wasImportant = formData.get("was_important") === "on";
        const wasUrgent = formData.get("was_urgent") === "on";
        const rating = parseInt(formData.get("productivity_rating") as string);
        const notes = formData.get("notes")?.toString();

        if (!rating || !notes) {
            setError("All fields are required.");
            return;
        }

        const res = await fetch(`/api/sessions/end?sessionId=${sessionId}`, {
            method: "POST",
            body: JSON.stringify({
                wasImportant,
                wasUrgent,
                rating,
                notes,
                endTime: new Date().toISOString(),
            }),
        });

        if (res.ok) {
            onSubmit(); 
            router.refresh();
        } else {
            setError("Failed to end session.");
        }
    }


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" className="mt-2">
                    End Session
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>End Session</AlertDialogTitle>
                </AlertDialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="was_important" />
                            Important
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="was_urgent" />
                            Urgent
                        </label>
                    </div>
                    <div>
                        <Label>Productivity Rating (1–5)</Label>
                        <input
                            name="productivity_rating"
                            type="number"
                            min={1}
                            max={5}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <Label>Notes</Label>
                        <textarea name="notes" className="w-full p-2 border rounded" required />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <AlertDialogFooter>
                        <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit">Save</AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}