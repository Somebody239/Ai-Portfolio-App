"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import DashboardView from "../views/DashboardView";
import { Loader2 } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          router.push("/login");
          return;
        }

        if (!session) {
          // Not logged in, redirect to login
          router.push("/login");
          return;
        }

        // User is logged in, check if they've completed onboarding
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name, intended_major")
          .eq("id", session.user.id)
          .single();

        if (userError && userError.code !== "PGRST116") {
          console.error("Error checking user data:", userError);
        }

        // If user doesn't have name or major, they need onboarding
        if (!userData || !userData.name || !userData.intended_major) {
          router.push("/onboarding");
          return;
        }

        // User is authenticated and has completed onboarding
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Error checking authentication:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/login");
      } else if (session) {
        // Check onboarding status on auth change
        supabase
          .from("users")
          .select("name, intended_major")
          .eq("id", session.user.id)
          .single()
          .then(({ data: userData }) => {
            if (!userData || !userData.name || !userData.intended_major) {
              router.push("/onboarding");
            } else {
              setIsAuthenticated(true);
            }
          });
      }
    });

    return () => subscription.unsubscribe();
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

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <DashboardView />;
}
