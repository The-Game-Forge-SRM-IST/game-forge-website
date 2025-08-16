'use client';

import { Control, Controller, FieldErrors, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Phone, GraduationCap, Building, Hash, AlertCircle } from 'lucide-react';
import { ApplicationFormData, PersonalInfoFormData, ACADEMIC_YEARS, DEPARTMENTS, getCoursesByDepartment } from '@/lib/validations/application';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useEffect } from 'react';

interface PersonalInfoStepProps {
  control: Control<ApplicationFormData>;
  errors?: FieldErrors<PersonalInfoFormData>;
  setValue?: (name: any, value: any) => void;
}

export function PersonalInfoStep({ control, errors, setValue }: PersonalInfoStepProps) {
  const { shouldReduceMotion } = useAccessibility();
  
  // Watch the department field to update courses dynamically
  const selectedDepartment = useWatch({
    control,
    name: 'personalInfo.department'
  });
  
  // Get available courses for the selected department
  const availableCourses = selectedDepartment ? getCoursesByDepartment(selectedDepartment) : [];
  
  // Reset course field when department changes
  useEffect(() => {
    if (setValue && selectedDepartment) {
      setValue('personalInfo.course', '');
    }
  }, [selectedDepartment, setValue]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 id="personal-info-heading" className="text-2xl font-bold text-white mb-2">Personal Information</h3>
        <p className="text-gray-400">Let&apos;s start with some basic information about you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Name Field */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? {} : { delay: 0.1 }}
        >
          <label 
            htmlFor="name-field"
            className="block text-sm sm:text-base font-medium text-gray-300 mb-2 sm:mb-3"
          >
            <User className="w-4 h-4 inline mr-2" aria-hidden="true" />
            Full Name *
          </label>
          <Controller
            name="personalInfo.name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="name-field"
                type="text"
                placeholder="Enter your full name"
                aria-required="true"
                aria-invalid={!!errors?.name}
                aria-describedby={errors?.name ? "name-error" : undefined}
                className={`
                  form-input w-full px-4 py-3 sm:py-4 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  transition-all duration-200 text-base
                  ${errors?.name ? 'border-red-500 focus:ring-red-500 aria-invalid:border-red-500' : 'border-gray-600'}
                `}
              />
            )}
          />
          {errors?.name && (
            <motion.div
              id="name-error"
              role="alert"
              aria-live="polite"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-400 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
              <span>{errors.name.message}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? {} : { delay: 0.2 }}
        >
          <label 
            htmlFor="email-field"
            className="block text-sm sm:text-base font-medium text-gray-300 mb-2 sm:mb-3"
          >
            <Mail className="w-4 h-4 inline mr-2" aria-hidden="true" />
            Email Address *
          </label>
          <Controller
            name="personalInfo.email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="email-field"
                type="email"
                placeholder="your.email@example.com"
                aria-required="true"
                aria-invalid={!!errors?.email}
                aria-describedby={errors?.email ? "email-error" : "email-help"}
                className={`
                  form-input w-full px-4 py-3 sm:py-4 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  transition-all duration-200 text-base
                  ${errors?.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'}
                `}
              />
            )}
          />
          <div id="email-help" className="sr-only">
            Enter a valid email address that you check regularly
          </div>
          {errors?.email && (
            <motion.div
              id="email-error"
              role="alert"
              aria-live="polite"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-400 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
              <span>{errors.email.message}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Phone Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number *
          </label>
          <Controller
            name="personalInfo.phone"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="tel"
                placeholder="+91 9876543210"
                className={`
                  w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  transition-all duration-200
                  ${errors?.phone ? 'border-red-500' : 'border-gray-600'}
                `}
              />
            )}
          />
          {errors?.phone && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.phone.message}
            </motion.p>
          )}
        </motion.div>

        {/* Academic Year Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <GraduationCap className="w-4 h-4 inline mr-2" />
            Academic Year *
          </label>
          <Controller
            name="personalInfo.year"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`
                  w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  transition-all duration-200
                  ${errors?.year ? 'border-red-500' : 'border-gray-600'}
                `}
              >
                <option value="" className="bg-gray-800">Select your academic year</option>
                {ACADEMIC_YEARS.map((year) => (
                  <option key={year} value={year} className="bg-gray-800">
                    {year}
                  </option>
                ))}
              </select>
            )}
          />
          {errors?.year && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.year.message}
            </motion.p>
          )}
        </motion.div>

        {/* Department Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Building className="w-4 h-4 inline mr-2" />
            Department *
          </label>
          <Controller
            name="personalInfo.department"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`
                  w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  transition-all duration-200
                  ${errors?.department ? 'border-red-500' : 'border-gray-600'}
                `}
              >
                <option value="" className="bg-gray-800">Select your department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-gray-800">
                    {dept}
                  </option>
                ))}
              </select>
            )}
          />
          {errors?.department && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.department.message}
            </motion.p>
          )}
        </motion.div>

        {/* Course Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <GraduationCap className="w-4 h-4 inline mr-2" />
            Course *
          </label>
          <Controller
            name="personalInfo.course"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={!selectedDepartment || availableCourses.length === 0}
                className={`
                  w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  transition-all duration-200
                  ${!selectedDepartment || availableCourses.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                  ${errors?.course ? 'border-red-500' : 'border-gray-600'}
                `}
              >
                <option value="" className="bg-gray-800">
                  {!selectedDepartment 
                    ? 'Select department first' 
                    : availableCourses.length === 0 
                    ? 'No courses available' 
                    : 'Select your course'
                  }
                </option>
                {availableCourses.map((course) => (
                  <option key={course} value={course} className="bg-gray-800">
                    {course}
                  </option>
                ))}
              </select>
            )}
          />
          {errors?.course && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.course.message}
            </motion.p>
          )}
        </motion.div>

        {/* Registration Number Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="md:col-span-2"
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Hash className="w-4 h-4 inline mr-2" />
            Registration Number *
          </label>
          <Controller
            name="personalInfo.registrationNumber"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="RA2111003010XXX"
                className={`
                  w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  transition-all duration-200
                  ${errors?.registrationNumber ? 'border-red-500' : 'border-gray-600'}
                `}
              />
            )}
          />
          {errors?.registrationNumber && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.registrationNumber.message}
            </motion.p>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 mt-6"
      >
        <p className="text-blue-300 text-sm">
          <strong>Note:</strong> All information provided will be kept confidential and used only for application processing.
        </p>
      </motion.div>
    </div>
  );
}