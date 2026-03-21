import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { applySessionCookie } from "@/lib/auth";
import { createUser, findUserByEmail, toSessionUser } from "@/lib/users";
import { getValidationMessage, registerSchema } from "@/lib/validators";

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Error &&
    "code" in error &&
    typeof error.code === "string" &&
    error.code.startsWith("SQLITE_CONSTRAINT")
  );
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = registerSchema.safeParse(payload);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: getValidationMessage(validation.error, "Please review the registration details."),
          fieldErrors: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    if (findUserByEmail(email)) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);
    const user = createUser({
      name,
      email,
      passwordHash
    });

    const response = NextResponse.json(
      {
        user: toSessionUser(user)
      },
      { status: 201 }
    );

    await applySessionCookie(response, toSessionUser(user), request);

    return response;
  } catch (error) {
    console.error("Registration error", error);

    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Unable to create your account right now." },
      { status: 500 }
    );
  }
}
