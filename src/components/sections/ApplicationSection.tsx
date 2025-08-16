'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  applicationFormSchema, 
  type ApplicationFormData
} from '@/lib/validations/application';
import { PersonalInfoStep } from '@/components/ui/PersonalInfoStep';
import { ExperienceStep } from '@/components/ui/ExperienceStep';
import { MotivationStep } from '@/components/ui/MotivationStep';

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

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
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
        portfolioUrl: ''
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
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, you would send the data to your backend
      console.log('Application submitted:', data);
      
      setSubmissionStatus('success');
      setSubmitMessage('Your application has been submitted successfully! We&apos;ll get back to you soon.');
    } catch (error) {
      setSubmissionStatus('error');
      setSubmitMessage('There was an error submitting your application. Please try again.');
      console.error('Submission error:', error);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalInfoStep control={control} errors={errors.personalInfo} setValue={setValue} />;
      case 'experience':
        return <ExperienceStep control={control} errors={errors.experience} />;
      case 'motivation':
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
              Join The Game Forge
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to level up your game development skills? Apply to become part of our creative community.
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
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
                    type="submit"
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
          </form>
        </motion.div>
      </div>
    </section>
  );
}