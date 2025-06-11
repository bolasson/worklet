import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  const { data: person, error } = await supabase
    .from("people")
    .select("name")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching person:", error.message);
  }
  
  const displayName = person?.name || user.email;

  return (
    <div className="flex items-center gap-4">
      Hey, {displayName}!
      <LogoutButton />
    </div>
  );
}