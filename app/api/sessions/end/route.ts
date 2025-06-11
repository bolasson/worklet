import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const body = await req.json();

    if (!sessionId) {
        return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from("sessions")
        .update({
            end_time: body.endTime,
            was_important: body.wasImportant,
            was_urgent: body.wasUrgent,
            productivity_rating: body.rating,
            notes: body.notes,
        })
        .eq("id", sessionId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}