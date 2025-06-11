import Link from "next/link";
import Image from "next/image";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Navbar() {
    return (
        <nav className="w-full bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Image
                    src="/favicon.ico"
                    alt="Worklet Logo"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                <span className="text-xl font-bold text-primary">Worklet</span>
                <Link
                    href="/projects"
                    className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                    Project Dashboard
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <AuthButton />
                {/* Optional: <ThemeSwitcher /> */}
            </div>
        </nav>
    );
}