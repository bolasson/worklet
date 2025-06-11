import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type DeleteUserRequest = {
    uid: string;
};

export async function POST(req: Request) {
    const body: DeleteUserRequest = await req.json();
    const { uid } = body;

    if (!uid) {
        return NextResponse.json({ error: "Missing UID" }, { status: 400 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false }, }
    );

    try {
        const { error } = await supabase.auth.admin.deleteUser(uid);
        if (error) throw error;
        return NextResponse.json({ message: "User deleted" });
    } catch (error: unknown) {
        let message = "An unexpected error occurred";
        if (error instanceof Error) {
            message = error.message;
        }
        return NextResponse.json({ error: message }, { status: 500 });
    }
}