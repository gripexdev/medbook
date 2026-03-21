"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import PageIntro from "@/components/PageIntro";
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
    eyebrow: "Sign In",
    title: "Access your bookings securely",
    description:
      "Appointments, confirmations, and cancellations are now tied to your account instead of a public email lookup.",
    submitLabel: "Sign In",
    alternateLabel: "Need an account?",
    alternateHref: "/register",
    alternateLinkText: "Create one",
    endpoint: "/api/auth/login"
  },
  register: {
    eyebrow: "Create Account",
    title: "Set up your MEDBOOK workspace",
    description:
      "Create a secure account once, then manage bookings, keep appointment history, and move through the scheduling flow without friction.",
    submitLabel: "Create Account",
    alternateLabel: "Already have an account?",
    alternateHref: "/login",
    alternateLinkText: "Sign in",
    endpoint: "/api/auth/register"
  }
} as const;

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
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const content = authCopy[mode];

  const handleChange = (field: keyof AuthFormValues, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: RegisterInput | LoginInput =
      mode === "register"
        ? {
            name: formValues.name,
            email: formValues.email,
            password: formValues.password,
            confirmPassword: formValues.confirmPassword
          }
        : {
            email: formValues.email,
            password: formValues.password
          };

    const validation =
      mode === "register" ? registerSchema.safeParse(payload) : loginSchema.safeParse(payload);

    if (!validation.success) {
      setErrors(flattenFieldErrors<keyof AuthFormValues>(validation.error.flatten().fieldErrors));
      setToast({
        title: "Check the form",
        message: "Please correct the highlighted fields before continuing.",
        variant: "error"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(content.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(validation.data)
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(flattenFieldErrors<keyof AuthFormValues>(data?.fieldErrors || {}));
        throw new Error(data?.error || "Unable to complete authentication.");
      }

      setToast({
        title: mode === "login" ? "Signed in" : "Account created",
        message: "Redirecting you to your MEDBOOK workspace.",
        variant: "success"
      });

      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      setToast({
        title: mode === "login" ? "Sign-in failed" : "Registration failed",
        message: error instanceof Error ? error.message : "Something went wrong.",
        variant: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-shell py-16">
      <div className="grid gap-8 lg:grid-cols-[0.94fr_1.06fr]">
        <section className="panel p-8 md:p-10">
          <PageIntro
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />

          <form className="mt-10 grid gap-6" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <InputField
                label="Full name"
                required
                placeholder="Jordan Lee"
                value={formValues.name}
                onChange={(event) => handleChange("name", event.target.value)}
                error={errors.name}
              />
            ) : null}

            <InputField
              label="Email address"
              required
              type="email"
              placeholder="jordan@example.com"
              value={formValues.email}
              onChange={(event) => handleChange("email", event.target.value)}
              error={errors.email}
            />

            <InputField
              label="Password"
              required
              type="password"
              placeholder={mode === "register" ? "Create a secure password" : "Enter your password"}
              value={formValues.password}
              onChange={(event) => handleChange("password", event.target.value)}
              error={errors.password}
            />

            {mode === "register" ? (
              <InputField
                label="Confirm password"
                required
                type="password"
                placeholder="Repeat your password"
                value={formValues.confirmPassword}
                onChange={(event) => handleChange("confirmPassword", event.target.value)}
                error={errors.confirmPassword}
              />
            ) : null}

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Please wait..." : content.submitLabel}
              </Button>
              <p className="text-sm text-slate-500">
                {content.alternateLabel}{" "}
                <Link
                  href={`${content.alternateHref}?redirectTo=${encodeURIComponent(redirectTo)}`}
                  className="font-semibold text-brand-700 transition hover:text-brand-800"
                >
                  {content.alternateLinkText}
                </Link>
              </p>
            </div>
          </form>
        </section>

        <aside className="panel-muted overflow-hidden p-8 md:p-10">
          <p className="eyebrow">Professional setup</p>
          <h2 className="mt-4 font-display text-[38px] font-semibold leading-[1.02] tracking-[-0.04em] text-slate-950 md:text-[48px]">
            Account-based booking with secure API access.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
            This version replaces the public demo behavior with authenticated sessions, private booking history, and account-scoped appointment management.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-[28px] border border-white/90 bg-white/90 p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Secure session cookies</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Authentication persists across the booking flow with protected server routes.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/90 bg-white/90 p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Private appointment history</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Each user sees only their own bookings and can cancel without exposing other records.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/90 bg-white/90 p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Validated booking input</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Forms and APIs share the same validation rules so bad input is blocked consistently.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {toast ? <Toast {...toast} /> : null}
    </div>
  );
}
