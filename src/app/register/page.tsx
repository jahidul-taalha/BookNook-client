import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";
import { FullPageLoader } from "@/components/site/full-page-loader";

export const metadata: Metadata = {
  title: "BookNook | Create Account",
  description:
    "Create a BookNook library card to borrow books, share favourites, and keep track of returns.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<FullPageLoader label="Preparing a fresh library card…" />}>
      <RegisterForm />
    </Suspense>
  );
}
