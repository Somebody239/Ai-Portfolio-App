"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import OnboardingFlow from "../../views/OnboardingView";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          // Not logged in, redirect to login
          router.push("/login");
          return;
        }

        // Check if user has already completed onboarding
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name, intended_major")
          .eq("id", session.user.id)
          .single();

        if (userError && userError.code !== "PGRST116") {
          console.error("Error checking user data:", userError);
        }

        // If user has completed onboarding, redirect to dashboard
        if (userData?.name && userData?.intended_major) {
          router.push("/");
          return;
        }

        // User is logged in but hasn't completed onboarding
        setLoading(false);
      } catch (err) {
        console.error("Error checking authentication:", err);
        router.push("/login");
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
          <p className="text-zinc-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <OnboardingFlow />;
}
