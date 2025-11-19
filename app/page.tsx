import DashboardView from "@/views/DashboardView";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <DashboardView />
    </ProtectedRoute>
  );
}
