'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  applicationFormSchema, 
  type ApplicationFormData
} from '@/lib/validations/application';
import { APPLICATION_CONFIG } from '@/config/application';
import { PersonalInfoStep } from '@/components/ui/PersonalInfoStep';
import { ExperienceStep } from '@/components/ui/ExperienceStep';
import { MotivationStep } from '@/components/ui/MotivationStep';

// === Configure Apps Script endpoint ===
const ENDPOINT = process.env.NEXT_PUBLIC_GOOGLE_SCRIPTS_URL ||
  "https://script.google.com/macros/s/AKfycbxO9ZF19tr8TfxJy9CXkYM28cGc4uP9ZkQX16Pjk_CAmKKeEVDq1_N7HT9F4R2FLlpt/exec";

type FormStep = 'personal' | 'experience' | 'motivation';
type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

const STEPS: { key: FormStep; title: string; subtitle: string }[] = [
  {
    key: 'personal',
    title: 'Personal Information',
    subtitle: 'Personal Identity'
  },
  {
    key: 'experience',
    title: 'Technical Experience',
    subtitle: 'Technical Expertise'
  },
  {
    key: 'motivation',
    title: 'Motivation & Goals',
    subtitle: 'Intent & Commitment'
  }
];

export default function ApplicationSection({ isOpen = false }: { isOpen?: boolean }) {
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isAppOpen, setIsAppOpen] = useState<boolean>(isOpen);

  useEffect(() => {
    fetch(`/api/application-status?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.isOpen === 'boolean') {
          setIsAppOpen(data.isOpen);
        }
      })
      .catch((err) => console.error('Failed to load live application status:', err));
  }, []);

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    mode: 'onChange',
    defaultValues: {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        year: '',
        department: '',
        course: '',
        registrationNumber: ''
      },
      experience: {
        programmingLanguages: [],
        gameEngines: [],
        previousProjects: '',
        portfolioUrl: '',
        // @ts-expect-error extra-default-props
        optional1: '',
        optional2: ''
      },
      motivation: {
        whyJoin: '',
        goals: '',
        availability: ''
      }
    }
  });

  const currentStepIndex = STEPS.findIndex(step => step.key === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const validateCurrentStep = async (): Promise<boolean> => {
    switch (currentStep) {
      case 'personal':
        return await trigger('personalInfo');
      case 'experience':
        return await trigger('experience');
      case 'motivation':
        return await trigger('motivation');
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid && !isLastStep) {
      setCurrentStep(STEPS[currentStepIndex + 1].key);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(STEPS[currentStepIndex - 1].key);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setSubmissionStatus('submitting');
    setSubmitMessage('');

    try {
      const payload = {
        Name: data.personalInfo.name,
        Email: data.personalInfo.email,
        Phone: data.personalInfo.phone,
        Year: data.personalInfo.year,
        Department: data.personalInfo.department,
        Course: data.personalInfo.course,
        "Registration Number": data.personalInfo.registrationNumber,
        "Programming Languages": data.experience.programmingLanguages.join(", "),
        "Game Engines": data.experience.gameEngines?.join(", ") || "",
        "Previous Projects": data.experience.previousProjects,
        "Portfolio URL": data.experience.portfolioUrl || '',
        "Why Join": data.motivation.whyJoin,
        Goals: data.motivation.goals,
        Availability: data.motivation.availability,
        // @ts-expect-error extra-optional-check
        Optional1: data.experience.optional1 || '',
        // @ts-expect-error extra-optional-check
        Optional2: data.experience.optional2 || '',
      };

      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(payload)) params.append(k, v);
      const encodedBody = params.toString().replace(/\+/g, "%20");

      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodedBody,
      });

      setSubmissionStatus("success");
      setSubmitMessage('Your credentials have been transmitted successfully. Our department leads will evaluate alignment.');
      reset();
      setCurrentStep('personal');
    } catch (err) {
      console.error("Submit error:", err);
      setSubmissionStatus("error");
      const message = (err instanceof Error) ? err.message : String(err);
      setSubmitMessage(`TRANSMISSION_ERROR: ${message}. Re-attempt transmission.`);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalInfoStep control={control as any} errors={errors.personalInfo} setValue={setValue} />;
      case 'experience':
        return <ExperienceStep control={control as any} errors={errors.experience} />;
      case 'motivation':
        return <MotivationStep control={control as any} errors={errors.motivation} />;
      default:
        return null;
    }
  };

  // Render when applications are closed
  if (!isAppOpen) {
    return (
      <section id="apply" className="py-24 px-margin-mobile md:px-margin-desktop max-w-5xl mx-auto w-full">
        <div className="forge-border bg-surface-container p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-2 right-2 flex gap-1">
            <div className="rivet" />
            <div className="rivet" />
          </div>
          <span className="material-symbols-outlined text-5xl text-secondary mb-6">lock_clock</span>
          <h2 className="font-sans text-3xl font-bold text-on-surface uppercase mb-4 tracking-tight">
            {APPLICATION_CONFIG.CLOSED_MESSAGE.title.toUpperCase()}
          </h2>
          <p className="font-mono text-xs md:text-sm text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
            {APPLICATION_CONFIG.CLOSED_MESSAGE.description}
          </p>
          <div className="bg-secondary/5 border border-secondary/20 p-4 mb-8 max-w-md mx-auto">
            <div className="font-mono text-xs font-bold text-secondary uppercase tracking-wider mb-1">
              STATUS: AWAITING NEXT HEATING SPRINT
            </div>
            <p className="font-mono text-[11px] text-on-surface-variant">
              {APPLICATION_CONFIG.CLOSED_MESSAGE.reopenMessage}
            </p>
          </div>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-secondary text-white font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
          >
            CONNECT_VIA_COMM_LINK
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="py-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Information / Casting steps */}
        <div className="lg:col-span-5">
          <div className="inline-block border border-tertiary text-tertiary font-mono text-[10px] font-bold px-3 py-1 mb-6 uppercase tracking-widest bg-tertiary/5">
            FORGE_STATUS: FIRES_ACTIVE
          </div>
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-on-surface uppercase mb-6 tracking-tight">
            COMMENCE FORGING
          </h2>
          <p className="font-mono text-xs md:text-sm text-on-surface-variant mb-12 leading-relaxed">
            Submit your credentials for review. Our Forge Masters evaluate every potential Forge Member within 48 operational hours.
          </p>

          <div className="space-y-8 border-t border-outline-variant/30 pt-8">
            {STEPS.map((step, idx) => {
              const isActive = currentStep === step.key;
              const isPast = currentStepIndex > idx;
              return (
                <div key={step.key} className="flex items-start gap-4 group">
                  <div className={`w-10 h-10 border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                    isActive 
                      ? 'border-tertiary text-tertiary bg-tertiary/5 scale-105' 
                      : isPast 
                      ? 'border-outline text-outline bg-surface-container-low' 
                      : 'border-outline-variant text-outline-variant'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h4 className={`font-sans text-sm font-bold uppercase mb-1 transition-colors ${
                      isActive ? 'text-on-surface' : 'text-on-surface-variant'
                    }`}>
                      {step.title}
                    </h4>
                    <p className="font-mono text-[11px] text-outline">
                      {idx === 0 && 'Please provide your contact and academic details.'}
                      {idx === 1 && 'Tell us about your programming and development skills.'}
                      {idx === 2 && 'Share your goals and why you want to join.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Multi-step Form Shell */}
        <div className="lg:col-span-7">
          <div className="forge-border bg-surface-container p-6 sm:p-8 lg:p-12 relative overflow-hidden shadow-2xl">
            {/* Form decorative background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10% 10%, #ac012c 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            {/* Segmented Phase Progress bar */}
            <div className="flex gap-1.5 mb-8 border-b border-outline-variant/30 pb-4">
              {STEPS.map((step, idx) => {
                const isActive = currentStep === step.key;
                const isCompleted = currentStepIndex >= idx;
                return (
                  <div key={step.key} className="flex-1">
                    <div className={`h-1.5 transition-all duration-300 ${
                      isActive 
                        ? 'bg-tertiary' 
                        : isCompleted 
                        ? 'bg-primary' 
                        : 'bg-outline-variant/30'
                    }`} />
                    <div className={`font-mono text-[9px] font-bold mt-1.5 uppercase tracking-wide hidden sm:block ${
                      isActive ? 'text-on-surface' : 'text-outline-variant'
                    }`}>
                      {step.subtitle}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Success screen */}
            {submissionStatus === 'success' ? (
              <div className="text-center py-10 relative z-10">
                <span className="material-symbols-outlined text-5xl text-tertiary mb-4 animate-pulse">done_all</span>
                <h3 className="font-sans text-2xl font-bold text-on-surface uppercase mb-3">
                  TRANSMISSION_COMPLETE
                </h3>
                <p className="font-mono text-xs md:text-sm text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed">
                  {submitMessage}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionStatus('idle');
                    setCurrentStep('personal');
                  }}
                  className="px-6 py-3 bg-primary text-black font-mono text-xs font-bold uppercase active:scale-95 hover:bg-white transition-all"
                >
                  TRANSMIT_NEW_CREDENTIALS
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6 relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderCurrentStep()}
                  </motion.div>
                </AnimatePresence>

                {/* Error Banner */}
                {submissionStatus === 'error' && (
                  <div className="p-4 bg-secondary/5 border border-secondary/20 font-mono text-xs text-secondary flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm mt-0.5">warning</span>
                    <p>{submitMessage}</p>
                  </div>
                )}

                {/* Navigation Controls */}
                <div className="flex justify-between items-center pt-6 border-t border-outline-variant/30 mt-8">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={isFirstStep || submissionStatus === 'submitting'}
                    className={`
                      px-6 py-3 font-mono text-xs font-bold uppercase active:scale-95 transition-all border flex items-center gap-1.5
                      ${isFirstStep || submissionStatus === 'submitting'
                        ? 'border-outline-variant/40 text-outline-variant/40 cursor-not-allowed'
                        : 'border-outline text-on-surface hover:bg-white/5'
                      }
                    `}
                  >
                    <span className="material-symbols-outlined text-sm">arrow_left_alt</span>
                    PREV
                  </button>

                  {isLastStep ? (
                    <button
                      type="button"
                      onClick={handleSubmit(onSubmit as any)}
                      disabled={submissionStatus === 'submitting'}
                      className="px-8 py-3 bg-secondary text-white font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      {submissionStatus === 'submitting' ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          TRANSMITTING...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">send</span>
                          TRANSMIT
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3 bg-primary text-black font-mono text-xs font-bold uppercase active:scale-95 hover:bg-white transition-all flex items-center gap-1.5"
                    >
                      NEXT
                      <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
