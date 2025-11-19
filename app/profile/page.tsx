import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import ProfileView from "@/views/ProfileView";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileView />
    </ProtectedRoute>
  );
}

