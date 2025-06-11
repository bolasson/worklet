"use client";

import { useState } from "react";

export default function DeleteUserPage() {
    const [uid, setUid] = useState("");
    const [status, setStatus] = useState<string | null>(null);

    const handleDelete = async () => {
        setStatus("Deleting...");
        try {
            const res = await fetch("/api/delete-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid }),
            });
    
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
    
            setStatus("✅ User deleted successfully.");
        } catch (err: unknown) {
            let message = "An unexpected error occurred";
            if (err instanceof Error) {
                message = err.message;
            }
            setStatus(`❌ Error: ${message}`);
        }
    };    

    return (
        <main className="max-w-lg mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">Delete Supabase User (Dev)</h1>
            <input
                type="text"
                placeholder="Enter UID"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                className="w-full border p-2 rounded"
            />
            <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Delete User
            </button>
            {status && <p className="text-sm mt-2">{status}</p>}
        </main>
    );
}