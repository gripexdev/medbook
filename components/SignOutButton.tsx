"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "@/components/Button";

type SignOutButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  label?: string;
};

export default function SignOutButton({
  variant = "ghost",
  size = "sm",
  className = "",
  label = "Sign Out"
}: SignOutButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignOut = async () => {
    setIsSubmitting(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST"
      });
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSubmitting}
      className={buttonClasses(variant, size, false, className)}
    >
      {isSubmitting ? "Signing out..." : label}
    </button>
  );
}
