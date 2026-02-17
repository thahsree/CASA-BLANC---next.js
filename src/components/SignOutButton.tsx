"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  className?: string;
  showIcon?: boolean;
  text?: string;
}

export default function SignOutButton({ 
  className = "", 
  showIcon = true,
  text = "Sign Out" 
}: SignOutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-red-500 ${className}`}
    >
      {showIcon && <LogOut className="h-4 w-4" />}
      {text}
    </button>
  );
}
