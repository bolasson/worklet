"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Info, Trash2 } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Button } from "@/components/ui/button";

type Project = {
    id: string;
    title: string;
    description: string;
    estimated_duration: string | null;
};

type Props = {
    project: Project;
    onDelete: (id: string) => void;
};

export default function ProjectCard({ project, onDelete }: Props) {
    return (
        <Card className="relative group hover:shadow-lg transition-shadow bg-muted border-2 border-muted-foreground w-1/4 min-w-[250px]">
            <CardHeader className="flex flex-row justify-between w-full space-x-2 space-y-0 items-start">
                <div className="w-5/6 overflow-hidden">
                    <Label
                        className="text-lg font-semibold truncate block w-full"
                        title={project.title}
                    >
                        {project.title}
                    </Label>
                    {project.estimated_duration && (
                        <>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                                {(() => {
                                    const [hStr, mStr] = project.estimated_duration.split(":");
                                    const hours = parseInt(hStr, 10);
                                    const minutes = parseInt(mStr, 10);
                                    return `Goal: ${hours} hr, ${minutes} min`;
                                })()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                                Total: 12 hr, 30 min
                            </p>
                        </>
                    )}
                </div>
                <div className="w-1/6 flex flex-col items-end">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-50 hover:opacity-100"
                                >
                                    <Info className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-sm">
                                {project.description || "No description provided."}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-75 hover:opacity-100 text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will delete <strong>{project.title}</strong> and all
                                    associated sessions. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete(project.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
        </Card>
    );
}