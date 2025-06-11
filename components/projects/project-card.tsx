import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Info, Trash2 } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
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

type Project = {
    id: string;
    title: string;
    description: string;
    estimated_duration: string | null;
    totalMinutes?: number;
};

type Props = {
    project: Project;
    onDelete: (id: string) => void;
};

export default function ProjectCard({ project, onDelete }: Props) {
    const totalMinutes = project.totalMinutes ?? 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return (
        <div className="w-1/4 min-w-[250px]">
            <Link href={`/projects/${project.id}`} className="block w-full h-full group">
                <Card className="w-full h-full bg-muted border-2 border-muted-foreground hover:shadow-lg transition-shadow relative">
                    <CardHeader className="flex flex-row justify-between items-start space-x-2">
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
                                            const [h, m] = project.estimated_duration.split(":");
                                            return `Goal: ${parseInt(h)} hr, ${parseInt(m)} min`;
                                        })()}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1 truncate">
                                        Total: {hours} hr {minutes} min
                                    </p>
                                </>
                            )}
                        </div>
                        <div
                            className="w-1/6 flex flex-col items-end"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-50 hover:opacity-100"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    >
                                        <Info className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs text-sm">
                                    {project.description || "No description provided."}
                                </TooltipContent>
                            </Tooltip>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-75 hover:opacity-100 text-destructive"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onDelete(project.id);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will delete <strong>{project.title}</strong> and all associated sessions.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                            Confirm
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardHeader>
                </Card>
            </Link>
        </div>
    );
}
