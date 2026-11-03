import { SignJWT } from "jose";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type TokenRequest = {
  email?: unknown;
  name?: unknown;
  sub?: unknown;
};

export async function POST(request: Request) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return Response.json(
      { message: "The library sign-in service is unavailable right now." },
      { status: 500 },
    );
  }

  let payload: TokenRequest;
  try {
    payload = (await request.json()) as TokenRequest;
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const sub = typeof payload.sub === "string" ? payload.sub.trim() : "";

  if (!EMAIL_PATTERN.test(email) || name.length < 2) {
    return Response.json(
      { message: "A valid name and email are required." },
      { status: 400 },
    );
  }

  const subject = sub || `reader-${email}`;

  const token = await new SignJWT({ email, name })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(subject)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(secret));

  return Response.json({ token });
}
