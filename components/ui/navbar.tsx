"use client";

import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";

type Props = {
    children: ReactNode;
};

export default function Navbar({ children }: Props) {
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
                {children}
            </div>
            <div className="flex gap-6">
                <Link
                    href="/projects"
                    className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                    Dashboard
                </Link>
            </div>
        </nav>
    );
}