// /views/OnboardingView.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  User, 
  GraduationCap, 
  School, 
  Loader2,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { UsersRepository } from "@/lib/supabase/repositories/users.repository";
import { ScoresRepository } from "@/lib/supabase/repositories/scores.repository";
import { UserTargetsRepository } from "@/lib/supabase/repositories/userTargets.repository";
import { UniversitiesRepository } from "@/lib/supabase/repositories/universities.repository";
import { useUniversities } from "@/hooks/useUniversities";
import { TestType } from "@/lib/types";
import { useRouter } from "next/navigation";

// --- TYPES & SCHEMAS (Data Validation) ---

// Step 1: Basic Identity
const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  intendedMajor: z.string().min(2, "Please enter a major"),
});

// Step 2: Academic Baseline
const academicSchema = z.object({
  currentGpa: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 4.0; // Assuming 4.0 scale for input
  }, "GPA must be between 0.0 and 4.0"),
  satScore: z.string().optional(), // Optional as per schema
});

// Step 3: Targets (Simple selection for MVP)
const targetSchema = z.object({
  dreamUniversity: z.string().min(1, "Select at least one target university"),
});

type OnboardingData = z.infer<typeof profileSchema> & 
                      z.infer<typeof academicSchema> & 
                      z.infer<typeof targetSchema>;

// --- REUSABLE UI ATOMS (The "Zinc" Theme) ---

const InputField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string, error?: string }>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">
          {label}
        </label>
        <div className="relative group">
          <input
            ref={ref}
            className={cn(
              "flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-100 ring-offset-black file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:border-transparent transition-all duration-300",
              error && "border-red-900 focus-visible:ring-red-500",
              className
            )}
            {...props}
          />
          {/* Subtle glow effect on focus */}
          <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        </div>
        {error && (
          <motion.span 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 ml-1 flex items-center gap-1"
          >
            <span className="w-1 h-1 rounded-full bg-red-400" />
            {error}
          </motion.span>
        )}
      </div>
    );
  }
);
InputField.displayName = "InputField";

const SelectCard = ({ 
  selected, 
  onClick, 
  title, 
  subtitle 
}: { 
  selected: boolean; 
  onClick: () => void; 
  title: string; 
  subtitle: string 
}) => (
  <div
    onClick={onClick}
    className={cn(
      "cursor-pointer relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
      selected 
        ? "bg-zinc-100 border-zinc-100" 
        : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900"
    )}
  >
    <div>
      <h4 className={cn("font-semibold text-sm", selected ? "text-black" : "text-white")}>{title}</h4>
      <p className={cn("text-xs", selected ? "text-zinc-600" : "text-zinc-500")}>{subtitle}</p>
    </div>
    {selected && (
      <div className="h-6 w-6 bg-black rounded-full flex items-center justify-center text-white">
        <Check size={14} strokeWidth={3} />
      </div>
    )}
  </div>
);

// --- MAIN ONBOARDING COMPONENT ---

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const totalSteps = 3;
  const router = useRouter();

  // Repositories
  const usersRepo = new UsersRepository();
  const scoresRepo = new ScoresRepository();
  const targetsRepo = new UserTargetsRepository();

  // Centralized State
  const [formData, setFormData] = useState<Partial<OnboardingData>>({});

  // Navigation Handlers
  const nextStep = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => Math.min(prev + 1, totalSteps + 1));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("You must be logged in to complete onboarding");
      }

      // 1. Update or create user profile
      const existingUser = await usersRepo.getById(user.id);
      
      // Parse GPA if provided
      const currentGpaNum = formData.currentGpa && formData.currentGpa.trim() !== "" 
        ? parseFloat(formData.currentGpa) 
        : null;
      
      if (existingUser) {
        // Update existing user
        await usersRepo.update(user.id, {
          name: formData.fullName || null,
          intended_major: formData.intendedMajor || null,
          current_gpa: currentGpaNum !== null && !isNaN(currentGpaNum) ? currentGpaNum : null,
        });
      } else {
        // Create new user record
        const { data: { user: authUser } } = await supabase.auth.getUser();
        await usersRepo.create({
          id: user.id,
          name: formData.fullName || null,
          email: authUser?.email || null,
          intended_major: formData.intendedMajor || null,
          current_gpa: currentGpaNum !== null && !isNaN(currentGpaNum) ? currentGpaNum : null,
        });
      }

      // 2. Save SAT score if provided
      if (formData.satScore && formData.satScore.trim() !== "") {
        const satScoreNum = parseFloat(formData.satScore);
        if (!isNaN(satScoreNum) && satScoreNum > 0) {
          await scoresRepo.create({
            user_id: user.id,
            test_type: TestType.SAT,
            score: satScoreNum,
          });
        }
      }

      // 3. Add university target
      if (formData.dreamUniversity) {
        await targetsRepo.create(user.id, formData.dreamUniversity);
      }

      // Success! Redirect to dashboard
      router.push("/");
    } catch (err: any) {
      console.error("Error saving onboarding data:", err);
      setError(err.message || "Failed to save your information. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Progress Bar Calculation
  const progress = ((step - 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Header / Progress */}
      <div className="w-full max-w-md z-10 mb-8 space-y-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono">
              {step > totalSteps ? totalSteps : step}
            </span>
            <span className="uppercase tracking-widest text-[10px]">Step</span>
          </div>
          <span className="text-zinc-500 text-xs font-mono">
            {step <= totalSteps ? "Setup Profile" : "Finalizing"}
          </span>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Main Card Area */}
      <div className="w-full max-w-md z-10 relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1Profile key="step1" onNext={nextStep} defaultValues={formData} />
          )}
          {step === 2 && (
            <Step2Academics key="step2" onNext={nextStep} onBack={prevStep} defaultValues={formData} />
          )}
          {step === 3 && (
            <Step3Targets key="step3" onNext={(data) => {
              setFormData(prev => ({ ...prev, ...data }));
              handleFinalSubmit();
            }} onBack={prevStep} isSubmitting={isSubmitting} error={error} />
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-6 text-zinc-600 text-xs font-mono z-10">
        Powered by UniPlanner AI
      </div>
    </div>
  );
}

// --- STEP 1: PROFILE ---

const Step1Profile = ({ onNext, defaultValues }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: defaultValues.fullName || "",
      intendedMajor: defaultValues.intendedMajor || ""
    }
  });

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={handleSubmit(onNext)}
      className="space-y-6"
    >
      <div className="space-y-2 text-center mb-8">
        <div className="w-12 h-12 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center mx-auto mb-4">
          <User className="text-zinc-400" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Who are you?</h2>
        <p className="text-zinc-500 text-sm">We need your details to personalize the AI recommendations.</p>
      </div>

      <InputField 
        label="Full Name" 
        placeholder="e.g. Alex Carter" 
        {...register("fullName")} 
        error={errors.fullName?.message as string}
        autoFocus
      />

      <InputField 
        label="Intended Major" 
        placeholder="e.g. Computer Science, Pre-Med" 
        {...register("intendedMajor")} 
        error={errors.intendedMajor?.message as string}
      />

      <button type="submit" className="w-full group relative flex items-center justify-center gap-2 h-12 bg-white text-black rounded-xl font-semibold text-sm hover:bg-zinc-200 transition-colors mt-4">
        Continue
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.form>
  );
};

// --- STEP 2: ACADEMICS ---

const Step2Academics = ({ onNext, onBack, defaultValues }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(academicSchema),
    defaultValues: {
      currentGpa: defaultValues.currentGpa || "",
      satScore: defaultValues.satScore || ""
    }
  });

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={handleSubmit(onNext)}
      className="space-y-6"
    >
      <div className="space-y-2 text-center mb-8">
        <div className="w-12 h-12 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="text-zinc-400" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Academic Standing</h2>
        <p className="text-zinc-500 text-sm">This sets the baseline for your "Safety" vs "Reach" calculations.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField 
          label="Current GPA (0-4.0)" 
          placeholder="3.8" 
          type="number"
          step="0.01"
          {...register("currentGpa")} 
          error={errors.currentGpa?.message as string}
          autoFocus
        />
        <InputField 
          label="SAT Score (Optional)" 
          placeholder="1450" 
          type="number"
          {...register("satScore")} 
          error={errors.satScore?.message as string}
        />
      </div>

      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 leading-relaxed">
        <span className="text-white font-semibold block mb-1">Note on accuracy:</span>
        You can upload your transcript later for automatic course extraction. For now, an estimate works.
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack} className="h-12 w-12 flex items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-900 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <button type="submit" className="flex-1 group relative flex items-center justify-center gap-2 h-12 bg-white text-black rounded-xl font-semibold text-sm hover:bg-zinc-200 transition-colors">
          Next Step
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.form>
  );
};

// --- STEP 3: TARGETS (Real Database Search) ---

const Step3Targets = ({ onNext, onBack, isSubmitting, error: submitError }: any) => {
  const { universities, loading: universitiesLoading } = useUniversities();
  const universitiesRepo = new UniversitiesRepository();
  const [selected, setSelected] = useState<string>("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUniversityName, setNewUniversityName] = useState("");
  const [newUniversityCountry, setNewUniversityCountry] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [allUniversities, setAllUniversities] = useState(universities);
  
  // Update allUniversities when universities data loads
  useEffect(() => {
    if (universities.length > 0) {
      setAllUniversities(universities);
    }
  }, [universities]);
  
  // Filter universities based on search
  const filteredUniversities = allUniversities.filter((uni) =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uni.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if search query doesn't match any existing university
  const hasNoMatches = searchQuery.trim() !== "" && filteredUniversities.length === 0 && !showCreateForm;

  const handleCreateUniversity = async () => {
    if (!newUniversityName.trim() || !newUniversityCountry.trim()) {
      setError("Please provide both university name and country.");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      // Check if university already exists
      const existing = allUniversities.find(
        (uni) => uni.name.toLowerCase() === newUniversityName.trim().toLowerCase()
      );

      if (existing) {
        setSelected(existing.id);
        setShowCreateForm(false);
        setNewUniversityName("");
        setNewUniversityCountry("");
        setIsCreating(false);
        return;
      }

      // Create new university
      const newUniversity = await universitiesRepo.create({
        name: newUniversityName.trim(),
        country: newUniversityCountry.trim(),
        avg_gpa: 0,
        avg_sat: 0,
        avg_act: 0,
        acceptance_rate: 0,
        tuition: 0,
      });

      // Add to local list
      setAllUniversities([...allUniversities, newUniversity]);
      
      // Select the newly created university
      setSelected(newUniversity.id);
      setShowCreateForm(false);
      setNewUniversityName("");
      setNewUniversityCountry("");
      setSearchQuery(newUniversity.name);
    } catch (err: any) {
      console.error("Error creating university:", err);
      setError(err.message || "Failed to create university. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      setError("Please select a dream university to start.");
      return;
    }
    onNext({ dreamUniversity: selected });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {isSubmitting ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-white">Building your Portfolio...</h3>
            <p className="text-sm text-zinc-500">Calculating admission probabilities</p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2 text-center mb-8">
            <div className="w-12 h-12 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center mx-auto mb-4">
              <School className="text-zinc-400" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">The Goal</h2>
            <p className="text-zinc-500 text-sm">Pick one "Dream School" to start your dashboard. You can add more later.</p>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">
              Search Universities
            </label>
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or country..."
                className={cn(
                  "flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:border-transparent transition-all duration-300"
                )}
              />
            </div>
          </div>

          {/* Universities List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {universitiesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
              </div>
            ) : showCreateForm ? (
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                <h4 className="text-sm font-semibold text-white">Add New University</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      University Name
                    </label>
                    <input
                      type="text"
                      value={newUniversityName}
                      onChange={(e) => setNewUniversityName(e.target.value)}
                      placeholder="e.g. Harvard University"
                      className={cn(
                        "flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:border-transparent transition-all duration-300"
                      )}
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Country
                    </label>
                    <input
                      type="text"
                      value={newUniversityCountry}
                      onChange={(e) => setNewUniversityCountry(e.target.value)}
                      placeholder="e.g. United States"
                      className={cn(
                        "flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:border-transparent transition-all duration-300"
                      )}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCreateUniversity}
                      disabled={isCreating}
                      className="flex-1 h-10 bg-white text-black rounded-lg font-semibold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          Add University
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewUniversityName("");
                        setNewUniversityCountry("");
                        setError("");
                      }}
                      className="h-10 px-4 border border-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-900 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : filteredUniversities.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-zinc-500 text-sm">
                  {searchQuery ? "No universities found matching your search." : "No universities available"}
                </p>
                {hasNoMatches && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(true);
                      setNewUniversityName(searchQuery);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Add "{searchQuery}" as new university
                  </button>
                )}
              </div>
            ) : (
              <>
                {filteredUniversities.map((uni) => (
                  <SelectCard
                    key={uni.id}
                    title={uni.name}
                    subtitle={uni.country}
                    selected={selected === uni.id}
                    onClick={() => {
                      setSelected(uni.id);
                      setError("");
                    }}
                  />
                ))}
                {hasNoMatches && (
                  <div className="pt-2 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(true);
                        setNewUniversityName(searchQuery);
                      }}
                      className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 hover:border-zinc-600 transition-all flex items-center justify-center gap-2 text-zinc-300 hover:text-white"
                    >
                      <Plus size={16} />
                      <span className="text-sm font-medium">Add "{searchQuery}" as new university</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          {submitError && <p className="text-xs text-red-400 text-center">{submitError}</p>}

          <div className="flex gap-3 pt-2">
            <button onClick={onBack} className="h-12 w-12 flex items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-900 transition-colors">
              <ArrowLeft size={18} />
            </button>
            <button 
              onClick={handleSubmit} 
              className="flex-1 group relative flex items-center justify-center gap-2 h-12 bg-white text-black rounded-xl font-semibold text-sm hover:bg-zinc-200 transition-colors"
            >
              Finish Setup
              <Check size={16} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

