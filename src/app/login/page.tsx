import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { FullPageLoader } from "@/components/site/full-page-loader";

export const metadata: Metadata = {
  title: "BookNook | Sign In",
  description:
    "Sign in to your BookNook library card to borrow books and manage your returns.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<FullPageLoader label="Opening the sign-in desk…" />}>
      <LoginForm />
    </Suspense>
  );
}
