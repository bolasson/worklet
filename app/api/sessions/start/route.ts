import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
        return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from("sessions").insert([
        {
            project_id: projectId,
            start_time: new Date().toISOString(),
            end_time: null,
            was_important: null,
            was_urgent: null,
            productivity_rating: null,
            notes: null,
        },
    ]);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}