'use client';

import { Control, Controller, FieldErrors, useWatch } from 'react-hook-form';
import { ApplicationFormData, PersonalInfoFormData, ACADEMIC_YEARS, DEPARTMENTS, getCoursesByDepartment } from '@/lib/validations/application';
import { useEffect } from 'react';

interface PersonalInfoStepProps {
  control: Control<ApplicationFormData>;
  errors?: FieldErrors<PersonalInfoFormData>;
  setValue?: (name: any, value: any) => void;
}

export function PersonalInfoStep({ control, errors, setValue }: PersonalInfoStepProps) {
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
      <div className="text-center mb-8 border-b border-outline-variant/30 pb-4">
        <h3 className="font-sans text-xl font-bold text-on-surface uppercase tracking-tight">
          Step 1: Personal Information
        </h3>
        <p className="font-mono text-xs text-on-surface-variant mt-1">
          Please provide your contact and academic details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label 
            htmlFor="name-field"
            className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest"
          >
            Name *
          </label>
          <Controller
            name="personalInfo.name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="name-field"
                type="text"
                placeholder="Enter your name"
                aria-required="true"
                aria-invalid={!!errors?.name}
                className={`
                  w-full bg-surface-container-low border p-3 text-on-surface font-mono text-sm
                  focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all placeholder:text-outline-variant
                  ${errors?.name ? 'border-secondary' : 'border-outline-variant'}
                `}
              />
            )}
          />
          {errors?.name && (
            <p role="alert" className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label 
            htmlFor="email-field"
            className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest"
          >
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
                placeholder="Enter email address"
                aria-required="true"
                aria-invalid={!!errors?.email}
                className={`
                  w-full bg-surface-container-low border p-3 text-on-surface font-mono text-sm
                  focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all placeholder:text-outline-variant
                  ${errors?.email ? 'border-secondary' : 'border-outline-variant'}
                `}
              />
            )}
          />
          {errors?.email && (
            <p role="alert" className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label 
            htmlFor="phone-field"
            className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest"
          >
            Phone Number *
          </label>
          <Controller
            name="personalInfo.phone"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="phone-field"
                type="tel"
                placeholder="Enter phone number"
                aria-required="true"
                aria-invalid={!!errors?.phone}
                className={`
                  w-full bg-surface-container-low border p-3 text-on-surface font-mono text-sm
                  focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all placeholder:text-outline-variant
                  ${errors?.phone ? 'border-secondary' : 'border-outline-variant'}
                `}
              />
            )}
          />
          {errors?.phone && (
            <p role="alert" className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Academic Year Field */}
        <div className="space-y-2">
          <label 
            htmlFor="year-field"
            className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest"
          >
            Academic Year *
          </label>
          <Controller
            name="personalInfo.year"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="year-field"
                aria-required="true"
                className={`
                  w-full bg-surface-container-low border p-3 text-on-surface font-mono text-sm appearance-none
                  focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all
                  ${errors?.year ? 'border-secondary' : 'border-outline-variant'}
                `}
              >
                <option value="" className="bg-surface-container-high">Select your year</option>
                {ACADEMIC_YEARS.map((year) => (
                  <option key={year} value={year} className="bg-surface-container-high">
                    {year.toUpperCase()}
                  </option>
                ))}
              </select>
            )}
          />
          {errors?.year && (
            <p role="alert" className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              {errors.year.message}
            </p>
          )}
        </div>

        {/* Department Field */}
        <div className="space-y-2">
          <label 
            htmlFor="dept-field"
            className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest"
          >
            Department *
          </label>
          <Controller
            name="personalInfo.department"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="dept-field"
                aria-required="true"
                className={`
                  w-full bg-surface-container-low border p-3 text-on-surface font-mono text-sm appearance-none
                  focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all
                  ${errors?.department ? 'border-secondary' : 'border-outline-variant'}
                `}
              >
                <option value="" className="bg-surface-container-high">Select your department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-surface-container-high">
                    {dept.toUpperCase()}
                  </option>
                ))}
              </select>
            )}
          />
          {errors?.department && (
            <p role="alert" className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              {errors.department.message}
            </p>
          )}
        </div>

        {/* Course Field */}
        <div className="space-y-2">
          <label 
            htmlFor="course-field"
            className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest"
          >
            Course *
          </label>
          <Controller
            name="personalInfo.course"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="course-field"
                aria-required="true"
                disabled={!selectedDepartment || availableCourses.length === 0}
                className={`
                  w-full bg-surface-container-low border p-3 text-on-surface font-mono text-sm appearance-none
                  focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all
                  ${!selectedDepartment || availableCourses.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}
                  ${errors?.course ? 'border-secondary' : 'border-outline-variant'}
                `}
              >
                <option value="" className="bg-surface-container-high font-mono text-xs">
                  {!selectedDepartment 
                    ? 'Select department first' 
                    : availableCourses.length === 0 
                    ? 'No courses available' 
                    : 'Select your course'
                  }
                </option>
                {availableCourses.map((course) => (
                  <option key={course} value={course} className="bg-surface-container-high font-mono text-xs">
                    {course.toUpperCase()}
                  </option>
                ))}
              </select>
            )}
          />
          {errors?.course && (
            <p role="alert" className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              {errors.course.message}
            </p>
          )}
        </div>

        {/* Registration Number Field */}
        <div className="space-y-2 md:col-span-2">
          <label 
            htmlFor="reg-field"
            className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest"
          >
            Registration Number *
          </label>
          <Controller
            name="personalInfo.registrationNumber"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="reg-field"
                type="text"
                placeholder="Enter registration number"
                aria-required="true"
                aria-invalid={!!errors?.registrationNumber}
                className={`
                  w-full bg-surface-container-low border p-3 text-on-surface font-mono text-sm
                  focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all placeholder:text-outline-variant
                  ${errors?.registrationNumber ? 'border-secondary' : 'border-outline-variant'}
                `}
              />
            )}
          />
          {errors?.registrationNumber && (
            <p role="alert" className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              {errors.registrationNumber.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}