import { AuthButton } from "@/components/auth-button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-background text-foreground">
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-6 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Worklet!</h1>
        <p className="text-lg text-muted-foreground">
          Master your time estimation skills by logging and reviewing your work sessions.
          Track your progress, reflect on productivity, and build better habits—one session at a time.
        </p>
        <p className="text-base text-muted-foreground">
          To get started, simply sign in or sign up and begin tracking your projects.
        </p>
        <AuthButton />
      </section>
    </main>
  );
}