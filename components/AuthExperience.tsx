"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import Toast from "@/components/Toast";
import { flattenFieldErrors, loginSchema, registerSchema } from "@/lib/validators";
import type { LoginInput, RegisterInput } from "@/lib/types";

type AuthExperienceProps = {
  mode: "login" | "register";
  redirectTo: string;
};

type AuthFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type AuthFieldErrors = Partial<Record<keyof AuthFormValues, string>>;

const authCopy = {
  login: {
    eyebrow: "SIGN IN",
    title: "Welcome back",
    description: "Access your appointments, booking history, and manage upcoming visits.",
    submitLabel: "Sign In",
    alternateLabel: "Don't have an account?",
    alternateHref: "/register",
    alternateLinkText: "Create one",
    endpoint: "/api/auth/login"
  },
  register: {
    eyebrow: "GET STARTED",
    title: "Create your account",
    description: "Set up your account to book appointments, view your history, and receive automated reminders.",
    submitLabel: "Create Account",
    alternateLabel: "Already have an account?",
    alternateHref: "/login",
    alternateLinkText: "Sign in",
    endpoint: "/api/auth/register"
  }
} as const;

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" strokeLinecap="round" />
      </svg>
    ),
    title: "Online booking",
    description: "Schedule appointments 24/7 with real-time availability."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zM14 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5zM4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4zM14 12a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-7z" />
      </svg>
    ),
    title: "Appointment history",
    description: "View past and upcoming visits all in one place."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3a6 6 0 0 1 6 6c0 3 1.5 5 2 6H4c.5-1 2-3 2-6a6 6 0 0 1 6-6zM10 21a2.5 2.5 0 0 0 4 0" strokeLinecap="round" />
      </svg>
    ),
    title: "Automated reminders",
    description: "Email notifications 24 hours before your appointment."
  }
];

export default function AuthExperience({ mode, redirectTo }: AuthExperienceProps) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<AuthFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string; variant: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const content = authCopy[mode];

  const handleChange = (field: keyof AuthFormValues, value: string) => {
    setFormValues((cur) => ({ ...cur, [field]: value }));
    setErrors((cur) => ({ ...cur, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: RegisterInput | LoginInput =
      mode === "register"
        ? { name: formValues.name, email: formValues.email, password: formValues.password, confirmPassword: formValues.confirmPassword }
        : { email: formValues.email, password: formValues.password };

    const validation = mode === "register" ? registerSchema.safeParse(payload) : loginSchema.safeParse(payload);

    if (!validation.success) {
      setErrors(flattenFieldErrors<keyof AuthFormValues>(validation.error.flatten().fieldErrors));
      setToast({ title: "Check the form", message: "Please correct the highlighted fields.", variant: "error" });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(content.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data)
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(flattenFieldErrors<keyof AuthFormValues>(data?.fieldErrors || {}));
        throw new Error(data?.error || "Unable to complete authentication.");
      }
      setToast({ title: mode === "login" ? "Signed in" : "Account created", message: "Redirecting you now...", variant: "success" });
      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      setToast({ title: mode === "login" ? "Sign-in failed" : "Registration failed", message: error instanceof Error ? error.message : "Something went wrong.", variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* Form card */}
          <div className="card p-6 sm:p-8">
            <p className="label">{content.eyebrow}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-jira-text-primary">
              {content.title}
            </h1>
            <p className="mt-1.5 text-sm text-jira-text-secondary">{content.description}</p>

            <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
              {mode === "register" ? (
                <InputField
                  label="Full name"
                  required
                  placeholder="Jordan Lee"
                  value={formValues.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  error={errors.name}
                />
              ) : null}

              <InputField
                label="Email address"
                required
                type="email"
                placeholder="jordan@example.com"
                value={formValues.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={errors.email}
              />

              <InputField
                label="Password"
                required
                type="password"
                placeholder={mode === "register" ? "Create a secure password" : "Enter your password"}
                value={formValues.password}
                onChange={(e) => handleChange("password", e.target.value)}
                error={errors.password}
              />

              {mode === "register" ? (
                <InputField
                  label="Confirm password"
                  required
                  type="password"
                  placeholder="Repeat your password"
                  value={formValues.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  error={errors.confirmPassword}
                />
              ) : null}

              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="submit" size="md" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? "Please wait..." : content.submitLabel}
                </Button>
                <p className="text-sm text-jira-text-secondary">
                  {content.alternateLabel}{" "}
                  <Link
                    href={`${content.alternateHref}?redirectTo=${encodeURIComponent(redirectTo)}`}
                    className="font-semibold text-brand-500 hover:text-brand-400"
                  >
                    {content.alternateLinkText}
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Feature sidebar */}
          <div className="hidden lg:block">
            <div className="rounded-lg bg-brand-600 p-6 text-white shadow-card">
              <p className="label text-brand-200">Why MEDBOOK?</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight">
                Modern healthcare, modern experience.
              </h2>
              <p className="mt-2 text-sm text-brand-100">
                No phone tag. No paper forms. Everything in one place.
              </p>
              <div className="mt-6 space-y-3">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-3 rounded-md border border-white/10 bg-white/5 p-3">
                    <span className="mt-0.5 shrink-0 text-brand-200">{feature.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{feature.title}</p>
                      <p className="mt-0.5 text-xs text-brand-100">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      {toast ? <Toast {...toast} /> : null}
    </div>
  );
}
