"use client";

import { useEffect, useState, useCallback, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import EndSessionDialog from "@/components/sessions/end-session-dialog";
import { format, startOfWeek, differenceInDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight } from "lucide-react";

type Project = {
    id: string;
    title: string;
    description: string;
    estimated_duration: string;
};

type Session = {
    id: string;
    project_id: string;
    start_time: string;
    end_time: string | null;
    was_important: boolean | null;
    was_urgent: boolean | null;
    productivity_rating: number | null;
    notes: string | null;
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [project, setProject] = useState<Project | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [collapsedWeeks, setCollapsedWeeks] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const { id } = use(params);
    const supabase = createClient();

    const fetchData = useCallback(async () => {
        const { data: projectData } = await supabase
            .from("projects")
            .select("*")
            .eq("id", id)
            .single();

        const { data: sessionData } = await supabase
            .from("sessions")
            .select("*")
            .eq("project_id", id);

        setProject(projectData);
        setSessions(sessionData || []);
        setLoading(false);

        const now = new Date();
        const autoCollapsed: Record<string, boolean> = {};
        sessionData?.forEach((s) => {
            const weekStart = format(startOfWeek(new Date(s.start_time), { weekStartsOn: 1 }), "yyyy-MM-dd");
            const diff = differenceInDays(now, new Date(weekStart));
            if (diff > 14) autoCollapsed[weekStart] = true;
        });
        setCollapsedWeeks((prev) => ({ ...prev, ...autoCollapsed }));
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="p-6 text-center text-muted-foreground">
                Loading project details...
            </div>
        );
    }

    const startSession = async () => {
        await supabase.from("sessions").insert([
            {
                project_id: id,
                start_time: new Date().toISOString(),
                end_time: null,
                was_important: null,
                was_urgent: null,
                productivity_rating: null,
                notes: null,
            },
        ]);
        fetchData();
    };

    const handleSessionEnded = () => {
        fetchData();
    };

    const activeSessions = sessions.filter((s) => !s.end_time);
    const pastSessions = sessions.filter((s) => s.end_time);

    const sessionsGrouped = pastSessions.reduce<Record<string, Session[]>>((acc, session) => {
        const date = new Date(session.start_time);
        const week = startOfWeek(date, { weekStartsOn: 1 });
        const weekKey = week.toISOString().split("T")[0];
        acc[weekKey] = acc[weekKey] || [];
        acc[weekKey].push(session);
        return acc;
    }, {});

    const sortedWeekGroups = Object.entries(sessionsGrouped).sort(
        ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );

    const [estHours, estMinutes] = project?.estimated_duration.split(":") ?? ["0", "0"];
    const estimatedMinutes = parseInt(estHours) * 60 + parseInt(estMinutes);
    const totalMinutes = pastSessions.reduce((acc, s) => {
        const start = new Date(s.start_time).getTime();
        const end = new Date(s.end_time!).getTime();
        return acc + Math.floor((end - start) / 1000 / 60);
    }, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const progress = Math.min(100, (totalMinutes / estimatedMinutes) * 100);

    const colorClass = progress < 40
        ? "bg-red-500"
        : progress < 80
            ? "bg-yellow-500"
            : "bg-green-500";

    if (loading) {
        return (
            <div className="p-6 text-center text-muted-foreground">
                Loading project details...
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 p-6">
            {/* Left: Project Info */}
            <div className="md:w-1/3 space-y-4">
                <h1 className="text-2xl font-bold">{project?.title}</h1>
                <p className="text-muted-foreground">{project?.description}</p>
                <div className="text-sm text-muted-foreground">
                    Estimated Duration: {parseInt(estHours)} hr {parseInt(estMinutes)} min
                </div>
                <div className="text-sm text-muted-foreground">
                    Total Time Spent: {totalHours} hr {remainingMinutes} min
                </div>
                <div className="text-sm text-muted-foreground">
                    <span>Progress:</span>
                    <Progress value={progress} className={`mt-2 h-3 [&>div]:${colorClass}`} />
                    <div className="text-xs mt-1">
                        {totalMinutes} of {estimatedMinutes} min tracked
                    </div>
                </div>
                <Button onClick={startSession} disabled={activeSessions.length > 0}>
                    {activeSessions.length > 0 ? "Session In Progress" : "+ Start New Session"}
                </Button>
            </div>

            {/* Right: Sessions */}
            <div className="md:w-2/3 space-y-6">
                <h2 className="text-2xl font-bold">Sessions</h2>

                {/* Active Sessions First */}
                {activeSessions.length > 0 && (
                    <div className="space-y-4">
                        {activeSessions.map((session) => (
                            <div
                                key={session.id}
                                className="border rounded p-4 bg-muted shadow-sm space-y-2"
                            >
                                <div className="text-sm text-[#11a4b1] font-medium">
                                    Session In Progress
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Started at: {new Date(session.start_time).toLocaleString()}
                                </div>
                                <EndSessionDialog
                                    sessionId={session.id}
                                    onSubmit={handleSessionEnded}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Past Sessions Grouped by Week/Day */}
                {sortedWeekGroups.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No sessions logged yet.</p>
                ) : (
                    sortedWeekGroups.map(([weekKey, weekSessions]) => {
                        const weekStartDate = new Date(weekKey);
                        const weekLabel = format(weekStartDate, "'Week of' MMM d, yyyy");
                        const totalWeekMinutes = weekSessions.reduce((acc, s) => {
                            const start = new Date(s.start_time).getTime();
                            const end = new Date(s.end_time!).getTime();
                            return acc + Math.floor((end - start) / 1000 / 60);
                        }, 0);
                        const weekCollapsed = collapsedWeeks[weekKey] ?? false;

                        return (
                            <div key={weekKey}>
                                <button
                                    onClick={() =>
                                        setCollapsedWeeks((prev) => ({
                                            ...prev,
                                            [weekKey]: !weekCollapsed,
                                        }))
                                    }
                                    className="flex items-center justify-between w-full text-left font-semibold text-lg rounded bg-card p-4"
                                >
                                    <span>
                                        {weekLabel} · {Math.floor(totalWeekMinutes / 60)} hr{" "}
                                        {totalWeekMinutes % 60} min
                                    </span>
                                    {weekCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {!weekCollapsed && (
                                    <>
                                        {Object.entries(
                                            weekSessions.reduce<Record<string, Session[]>>((acc, session) => {
                                                const day = format(new Date(session.start_time), "EEEE, MMMM d");
                                                acc[day] = acc[day] || [];
                                                acc[day].push(session);
                                                return acc;
                                            }, {})
                                        )
                                            .sort(
                                                ([a], [b]) =>
                                                    new Date(b).getTime() - new Date(a).getTime()
                                            )
                                            .map(([day, daySessions]) => {
                                                const sortedSessions = [...daySessions].sort(
                                                    (a, b) =>
                                                        new Date(b.start_time).getTime() -
                                                        new Date(a.start_time).getTime()
                                                );

                                                const totalDayMinutes = sortedSessions.reduce((acc, s) => {
                                                    const start = new Date(s.start_time).getTime();
                                                    const end = new Date(s.end_time!).getTime();
                                                    return acc + Math.floor((end - start) / 1000 / 60);
                                                }, 0);

                                                return (
                                                    <div key={day} className="mt-4">
                                                        <h4 className="text-md font-medium text-muted-foreground mb-2">
                                                            {day} · {Math.floor(totalDayMinutes / 60)} hr{" "}
                                                            {totalDayMinutes % 60} min
                                                        </h4>
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {sortedSessions.map((session) => (
                                                                <div
                                                                    key={session.id}
                                                                    className="border rounded p-4 bg-muted shadow-sm space-y-2"
                                                                >
                                                                    <div className="flex justify-between text-sm items-center font-bold">
                                                                        <span>
                                                                            {new Date(session.start_time).toLocaleTimeString([], {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            })}{" "}
                                                                            →{" "}
                                                                            {new Date(session.end_time!).toLocaleTimeString([], {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            })}
                                                                        </span>
                                                                        <span>
                                                                            {new Date(session.start_time).toLocaleDateString("en-US", {
                                                                                month: "2-digit",
                                                                                day: "2-digit",
                                                                                year: "2-digit",
                                                                            })}
                                                                            {new Date(session.start_time).toDateString() !==
                                                                                new Date(session.end_time!).toDateString() && (
                                                                                    <>
                                                                                        {" → "}
                                                                                        {new Date(session.end_time!).toLocaleDateString("en-US", {
                                                                                            month: "2-digit",
                                                                                            day: "2-digit",
                                                                                            year: "2-digit",
                                                                                        })}
                                                                                    </>
                                                                                )}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-sm flex items-center gap-2">
                                                                        <p>Productivity Score:</p>
                                                                        <span
                                                                            className={`w-3 h-3 rounded-full inline-block ${session.productivity_rating === 1
                                                                                ? "bg-red-500"
                                                                                : session.productivity_rating === 2
                                                                                    ? "bg-orange-500"
                                                                                    : session.productivity_rating === 3
                                                                                        ? "bg-yellow-500"
                                                                                        : session.productivity_rating === 4
                                                                                            ? "bg-green-500"
                                                                                            : "bg-blue-500"
                                                                                }`}
                                                                        ></span>
                                                                        <span>
                                                                            {session.productivity_rating === 1
                                                                                ? "Very Low"
                                                                                : session.productivity_rating === 2
                                                                                    ? "Low"
                                                                                    : session.productivity_rating === 3
                                                                                        ? "Moderate"
                                                                                        : session.productivity_rating === 4
                                                                                            ? "High"
                                                                                            : "Very High"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-sm">
                                                                        I worked on items that were{" "}
                                                                        {session.was_important ? "important" : "not important"} and{" "}
                                                                        {session.was_urgent ? "urgent" : "not urgent"}.
                                                                    </div>
                                                                    {session.notes && (
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Notes: <i>{session.notes}</i>
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}