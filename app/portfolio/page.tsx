import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import PortfolioView from "@/views/PortfolioView";

export default function PortfolioPage() {
  return (
    <ProtectedRoute>
      <PortfolioView />
    </ProtectedRoute>
  );
}

