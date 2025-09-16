'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send, CheckCircle, AlertCircle, Clock, Bell } from 'lucide-react';
import { 
  applicationFormSchema, 
  type ApplicationFormData
} from '@/lib/validations/application';
import { APPLICATION_CONFIG } from '@/config/application';
import { PersonalInfoStep } from '@/components/ui/PersonalInfoStep';
import { ExperienceStep } from '@/components/ui/ExperienceStep';
import { MotivationStep } from '@/components/ui/MotivationStep';

// === Configure your endpoint here (same as working first form) ===
const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbxO9ZF19tr8TfxJy9CXkYM28cGc4uP9ZkQX16Pjk_CAmKKeEVDq1_N7HT9F4R2FLlpt/exec";

type FormStep = 'personal' | 'experience' | 'motivation';
type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

const STEPS: { key: FormStep; title: string; description: string }[] = [
  {
    key: 'personal',
    title: 'Personal Information',
    description: 'Tell us about yourself'
  },
  {
    key: 'experience',
    title: 'Technical Experience',
    description: 'Share your skills and projects'
  },
  {
    key: 'motivation',
    title: 'Motivation & Goals',
    description: 'Why do you want to join us?'
  }
];

export default function ApplicationSection() {
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // Check if applications are closed
  if (!APPLICATION_CONFIG.APPLICATION_OPEN) {
    return (
      <section id="apply" className="min-h-screen bg-gradient-to-br from-orange-900/20 via-gray-900 to-red-900/20 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-orange-500/20">
              <Clock className="w-16 h-16 text-orange-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                {APPLICATION_CONFIG.CLOSED_MESSAGE.title}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {APPLICATION_CONFIG.CLOSED_MESSAGE.description}
              </p>
              <div className="bg-orange-900/20 border border-orange-500/20 rounded-lg p-4 mb-8">
                <div className="flex items-center justify-center mb-2">
                  <Bell className="w-5 h-5 text-orange-400 mr-2" />
                  <span className="text-orange-400 font-medium">Stay Updated</span>
                </div>
                <p className="text-orange-300 text-sm">
                  {APPLICATION_CONFIG.CLOSED_MESSAGE.reopenMessage}
                </p>
              </div>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                Contact Us for Updates
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

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
  // @ts-expect-error default-value-extra
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
      // Prepare payload exactly like the working first form with proper field names for Google Sheets
      const payload = {
        Name: data.personalInfo.name,
        Email: data.personalInfo.email,
        Phone: data.personalInfo.phone,
        Year: data.personalInfo.year,
        Department: data.personalInfo.department,
        Course: data.personalInfo.course,
        "Registration Number": data.personalInfo.registrationNumber,
        "Programming Languages": data.experience.programmingLanguages.join(", "),
  // @ts-expect-error array-join
  "Game Engines": data.experience.gameEngines.join(", "),
        "Previous Projects": data.experience.previousProjects,
        "Portfolio URL": data.experience.portfolioUrl || '',
        "Why Join": data.motivation.whyJoin,
        Goals: data.motivation.goals,
        Availability: data.motivation.availability,
  // @ts-expect-error extra-optional
  Optional1: data.experience.optional1 || '',
  // @ts-expect-error extra-optional
  Optional2: data.experience.optional2 || '',
      };

      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(payload)) params.append(k, v);

      // Convert + in keys into %20 so Apps Script matches your sheet headers
  const encodedBody = params.toString().replace(/\+/g, "%20");

      // Debug logs
      console.table(payload);
      console.log("Encoded body (fixed):", encodedBody);

  await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors", // avoid CORS errors with Apps Script; response will be opaque
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodedBody,
      });

      // With no-cors, we can't read res.ok. Assume success if no network error.
      setSubmissionStatus("success");
      setSubmitMessage('Your application has been submitted successfully! We\'ll get back to you soon.');

      // Reset form
      reset();
      setCurrentStep('personal');
    } catch (err) {
      console.error("Submit error:", err);
      setSubmissionStatus("error");
      const message = (err instanceof Error) ? err.message : String(err);
      setSubmitMessage(`There was an error submitting your application: ${message}. Please check the console and try again.`);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal':
        // @ts-expect-error runtime-prop
        return <PersonalInfoStep control={control} errors={errors.personalInfo} setValue={setValue} />;
      case 'experience':
          // @ts-expect-error runtime-prop
          return <ExperienceStep control={control} errors={errors.experience} />;
      case 'motivation':
          // @ts-expect-error runtime-prop
          return <MotivationStep control={control} errors={errors.motivation} />;
      default:
        return null;
    }
  };

  if (submissionStatus === 'success') {
    return (
      <section id="apply" className="min-h-screen bg-gradient-to-br from-green-900/20 via-gray-900 to-blue-900/20 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-green-500/20">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Application Submitted!</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {submitMessage}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSubmissionStatus('idle');
                  setCurrentStep('personal');
                  reset();
                }}
                className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Submit Another Application
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="min-h-screen bg-gradient-to-br from-green-900/20 via-gray-900 to-blue-900/20 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {APPLICATION_CONFIG.OPEN_MESSAGE.title}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {APPLICATION_CONFIG.OPEN_MESSAGE.description}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8 sm:mb-12">
            {/* Mobile Progress Indicator */}
            <div className="sm:hidden">
              <div className="flex justify-center items-center mb-4">
                <div className="flex space-x-2">
                  {STEPS.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        index <= currentStepIndex ? 'bg-green-600' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-white mb-1">
                  {STEPS[currentStepIndex].title}
                </div>
                <div className="text-sm text-gray-400">
                  Step {currentStepIndex + 1} of {STEPS.length}
                </div>
              </div>
            </div>

            {/* Desktop Progress Indicator */}
            <div className="hidden sm:flex justify-between items-center max-w-3xl mx-auto">
              {STEPS.map((step, index) => (
                <div key={step.key} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div className={`
                      w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-sm lg:text-base font-bold transition-all duration-300
                      ${index <= currentStepIndex 
                        ? 'bg-green-600 text-white scale-110' 
                        : 'bg-gray-700 text-gray-400'
                      }
                    `}>
                      {index + 1}
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <div className={`text-sm lg:text-base font-medium transition-colors duration-300 ${
                        index <= currentStepIndex ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-500">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`
                      flex-1 h-0.5 mx-4 lg:mx-6 transition-colors duration-300
                      ${index < currentStepIndex ? 'bg-green-600' : 'bg-gray-700'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-700/50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCurrentStep()}
                </motion.div>
              </AnimatePresence>

              {/* Error Message */}
              {submissionStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg flex items-center"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                  <p className="text-red-300">{submitMessage}</p>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-0 mt-8 pt-6 border-t border-gray-700/50">
                <motion.button
                  type="button"
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                  whileHover={!isFirstStep ? { scale: 1.02 } : {}}
                  whileTap={!isFirstStep ? { scale: 0.98 } : {}}
                  className={`
                    flex items-center justify-center px-6 py-3 sm:py-4 rounded-lg font-medium transition-all touch-manipulation min-h-[48px]
                    ${isFirstStep 
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed order-2 sm:order-1' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white order-2 sm:order-1'
                    }
                  `}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </motion.button>

                {isLastStep ? (
                  <motion.button
                    type="button"
                      // @ts-expect-error handleSubmit-callback
                      onClick={handleSubmit(onSubmit)}
                    disabled={submissionStatus === 'submitting'}
                    whileHover={submissionStatus !== 'submitting' ? { scale: 1.02 } : {}}
                    whileTap={submissionStatus !== 'submitting' ? { scale: 0.98 } : {}}
                    className={`
                      flex items-center justify-center px-8 py-3 sm:py-4 rounded-lg font-medium transition-all touch-manipulation min-h-[48px] order-1 sm:order-2
                      ${submissionStatus === 'submitting'
                        ? 'bg-green-600/50 text-green-300 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                      }
                    `}
                  >
                    {submissionStatus === 'submitting' ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-green-300 border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">Submitting...</span>
                        <span className="sm:hidden">Submitting</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Submit Application</span>
                        <span className="sm:hidden">Submit</span>
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center px-6 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors touch-manipulation min-h-[48px] order-1 sm:order-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

