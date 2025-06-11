"use client";

import CreateProjectDialog from "@/components/projects/create-project-dialog";
import ProjectCard from "@/components/projects/project-card";
import { createClient } from "@/lib/supabase/client";
import { fetchProjectDurations } from "@/lib/supabase/queries";
import { useEffect, useState } from "react";

export type Project = {
    id: string;
    title: string;
    description: string;
    estimated_duration: string | null;
};

export type ProjectWithTime = Project & {
    totalMinutes?: number;
};

export default function ProjectDashboard() {
    const [projects, setProjects] = useState<ProjectWithTime[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("person_id", user.id)
                .order("created_at", { ascending: false });

            if (!error && data) {
                const durations = await fetchProjectDurations(data.map((p) => p.id));
                const projectsWithTime = data.map((project) => ({
                    ...project,
                    totalMinutes: durations[project.id] ?? 0,
                }));
                setProjects(projectsWithTime);
            }
            setLoading(false);
        };

        fetchProjects();
    }, []);

    const handleDelete = async (id: string) => {
        const supabase = createClient();
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (!error) setProjects((prev) => prev.filter((p) => p.id !== id));
    };

    const handleCreate = (project: Project) => {
        setProjects((prev) => [project, ...prev]);
    };

    if (loading) {
        return (
            <main className="p-6">
                <div className="text-center">Loading projects...</div>
            </main>
        );
    }

    return (
        <main className="p-6">
            <CreateProjectDialog onCreate={handleCreate} />
            <div className="flex flex-wrap gap-6">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </main>
    );
}