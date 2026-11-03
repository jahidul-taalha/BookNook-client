import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";
import { ProtectedRoute } from "@/components/site/protected-route";

export const metadata: Metadata = {
  title: "BookNook | Profile",
  description:
    "Your BookNook library card, account details, and quick links to your shelves.",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute label="Opening your library card…">
      <ProfileView />
    </ProtectedRoute>
  );
}
