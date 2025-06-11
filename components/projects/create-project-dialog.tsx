"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Props = {
    onCreate: (project: any) => void;
};

export default function CreateProjectDialog({ onCreate }: Props) {
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const supabase = createClient();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title")?.toString().trim() || "";
        const description = formData.get("description")?.toString().trim() || "";
        const hoursStr = formData.get("hours")?.toString().trim() || "0";
        const minutesStr = formData.get("minutes")?.toString().trim() || "0";

        const errors: Record<string, string> = {};
        if (!title) errors.title = "Title is required.";
        if (!description) errors.description = "Description is required.";
        if (!hoursStr && !minutesStr) errors.duration = "Estimated duration is required.";

        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        const isValidDuration =
            !isNaN(hours) && !isNaN(minutes) && (hours > 0 || minutes > 0);

        if (!isValidDuration) errors.duration = "Duration must be at least 1 minute.";

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const intervalString = `${hours}:${minutes.toString().padStart(2, "0")}`;

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
            .from("projects")
            .insert([
                {
                    title,
                    description,
                    estimated_duration: intervalString,
                    person_id: user.id,
                },
            ])
            .select()
            .single();

        if (!error && data) {
            onCreate(data);
            setFormErrors({});
            setOpen(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="mb-6">New Project</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create New Project</AlertDialogTitle>
                    <AlertDialogDescription>
                        Fill in the details to start a new project.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <input id="title" name="title" className="w-full p-2 border rounded" />
                        {formErrors.title && (
                            <p className="text-sm text-red-500 mt-1">{formErrors.title}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea id="description" name="description" className="w-full p-2 border rounded" />
                        {formErrors.description && (
                            <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>
                        )}
                    </div>
                    <div>
                        <Label>Estimated Duration</Label>
                        <div className="flex gap-4">
                            <input
                                name="hours"
                                type="number"
                                placeholder="Hours"
                                className="w-full p-2 border rounded"
                            />
                            <input
                                name="minutes"
                                type="number"
                                placeholder="Minutes"
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        {formErrors.duration && (
                            <p className="text-sm text-red-500 mt-1">{formErrors.duration}</p>
                        )}
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit">Create</AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}