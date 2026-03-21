import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { applySessionCookie } from "@/lib/auth";
import { findUserByEmail, toSessionUser } from "@/lib/users";
import { getValidationMessage, loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = loginSchema.safeParse(payload);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: getValidationMessage(validation.error, "Please review your sign-in details."),
          fieldErrors: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const user = findUserByEmail(validation.data.email);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordMatches = await compare(validation.data.password, user.passwordHash);

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const sessionUser = toSessionUser(user);
    const response = NextResponse.json({ user: sessionUser });
    await applySessionCookie(response, sessionUser, request);

    return response;
  } catch (error) {
    console.error("Login error", error);

    return NextResponse.json(
      { error: "Unable to sign you in right now." },
      { status: 500 }
    );
  }
}
