import { createClient } from "@/lib/supabase/client";

export const fetchProjectDurations = async (projectIds: string[]) => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("sessions")
        .select("project_id, start_time, end_time")
        .in("project_id", projectIds);

    if (error) throw error;

    const durations: Record<string, number> = {};

    data.forEach((session) => {
        if (session.end_time) {
            const start = new Date(session.start_time).getTime();
            const end = new Date(session.end_time).getTime();
            const duration = Math.floor((end - start) / 1000 / 60);
            durations[session.project_id] = (durations[session.project_id] || 0) + duration;
        }
    });

    return durations;
};