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
    eyebrow: "Welcome back",
    title: "Sign in to your account",
    description:
      "Access your appointments, booking history, and manage upcoming visits.",
    submitLabel: "Sign In",
    alternateLabel: "Don't have an account?",
    alternateHref: "/register",
    alternateLinkText: "Create one",
    endpoint: "/api/auth/login"
  },
  register: {
    eyebrow: "Get started",
    title: "Create your patient account",
    description:
      "Set up your account to book appointments, view your history, and receive automated reminders.",
    submitLabel: "Create Account",
    alternateLabel: "Already have an account?",
    alternateHref: "/login",
    alternateLinkText: "Sign in",
    endpoint: "/api/auth/register"
  }
} as const;

const features = [
  {
    title: "Online booking",
    description: "Schedule appointments 24/7 with real-time availability."
  },
  {
    title: "Appointment history",
    description: "View past and upcoming visits all in one place."
  },
  {
    title: "Automated reminders",
    description: "Get email notifications 24 hours before your appointment."
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
        message: "Redirecting you now...",
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
    <div className="section-shell py-12 md:py-16">
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-[32px] border border-slate-200/60 bg-white p-6 sm:p-8 md:p-10">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1 className="mt-3 font-display text-[28px] font-semibold leading-tight tracking-[-0.03em] text-slate-950 sm:text-[34px]">
            {content.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{content.description}</p>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
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

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? "Please wait..." : content.submitLabel}
              </Button>
              <p className="text-sm text-slate-500">
                {content.alternateLabel}{" "}
                <Link
                  href={`${content.alternateHref}?redirectTo=${encodeURIComponent(redirectTo)}`}
                  className="font-semibold text-brand-600 transition hover:text-brand-700"
                >
                  {content.alternateLinkText}
                </Link>
              </p>
            </div>
          </form>
        </section>

        <aside className="hidden lg:flex lg:flex-col lg:justify-center">
          <div className="dark-gradient rounded-[32px] p-8 text-white md:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-brand-300">Why MEDBOOK?</p>
            <h2 className="mt-4 font-display text-[28px] font-semibold leading-tight tracking-[-0.03em] sm:text-[34px]">
              Modern healthcare deserves a modern experience.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              No more phone tag or paper forms. Everything you need to manage your healthcare appointments, in one place.
            </p>

            <div className="mt-8 grid gap-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-white">{feature.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {toast ? <Toast {...toast} /> : null}
    </div>
  );
}
