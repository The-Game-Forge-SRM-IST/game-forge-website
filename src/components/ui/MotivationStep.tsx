'use client';

import { Control, Controller, FieldErrors } from 'react-hook-form';
import { ApplicationFormData, MotivationFormData } from '@/lib/validations/application';

interface MotivationStepProps {
  control: Control<ApplicationFormData>;
  errors?: FieldErrors<MotivationFormData>;
}

export function MotivationStep({ control, errors }: MotivationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8 border-b border-outline-variant/30 pb-4">
        <h3 className="font-sans text-xl font-bold text-on-surface uppercase tracking-tight">
          Step 3: Motivation & Goals
        </h3>
        <p className="font-mono text-xs text-on-surface-variant mt-1">
          Share your goals and why you want to join.
        </p>
      </div>

      {/* Why Join */}
      <div className="space-y-2">
        <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          Why do you want to join The Game Forge? *
        </label>
        <Controller
          name="motivation.whyJoin"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <textarea
                {...field}
                rows={4}
                placeholder="Share what draws you to game development and why you want to be part of our community. What excites you about creating games? What do you hope to contribute to the club?"
                className={`
                  w-full bg-surface-container-low border p-3 text-on-surface font-mono text-xs placeholder:text-outline-variant resize-none pr-16
                  focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all
                  ${errors?.whyJoin ? 'border-secondary' : 'border-outline-variant'}
                `}
              />
              <div className="absolute bottom-3 right-3 font-mono text-[10px] text-outline-variant">
                {field.value?.length || 0}/500
              </div>
            </div>
          )}
        />
        {errors?.whyJoin && (
          <p role="alert" className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">warning</span>
            {errors.whyJoin.message}
          </p>
        )}
      </div>

      {/* Goals */}
      <div className="space-y-2">
        <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          What are your goals in game development? *
        </label>
        <Controller
          name="motivation.goals"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <textarea
                {...field}
                rows={4}
                placeholder="Describe your short-term and long-term goals in game development. What skills do you want to develop? What type of games do you want to create? How do you see yourself growing in this field?"
                className={`
                  w-full bg-surface-container-low border p-3 text-on-surface font-mono text-xs placeholder:text-outline-variant resize-none pr-16
                  focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all
                  ${errors?.goals ? 'border-secondary' : 'border-outline-variant'}
                `}
              />
              <div className="absolute bottom-3 right-3 font-mono text-[10px] text-outline-variant">
                {field.value?.length || 0}/500
              </div>
            </div>
          )}
        />
        {errors?.goals && (
          <p role="alert" className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">warning</span>
            {errors.goals.message}
          </p>
        )}
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          Time Commitment & Availability *
        </label>
        <Controller
          name="motivation.availability"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <textarea
                {...field}
                rows={3}
                placeholder="How much time can you dedicate to club activities per week? Are there specific days/times that work best for you? Any scheduling constraints we should know about?"
                className={`
                  w-full bg-surface-container-low border p-3 text-on-surface font-mono text-xs placeholder:text-outline-variant resize-none pr-16
                  focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all
                  ${errors?.availability ? 'border-secondary' : 'border-outline-variant'}
                `}
              />
              <div className="absolute bottom-3 right-3 font-mono text-[10px] text-outline-variant">
                {field.value?.length || 0}/200
              </div>
            </div>
          )}
        />
        {errors?.availability && (
          <p role="alert" className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">warning</span>
            {errors.availability.message}
          </p>
        )}
      </div>

      {/* Expectations Workbench Card */}
      <div className="forge-border bg-surface-container-low p-6 relative overflow-hidden">
        <div className="absolute top-2 right-2 flex gap-1">
          <div className="rivet" />
          <div className="rivet" />
        </div>
        <h4 className="font-sans text-sm font-bold text-on-surface mb-4 uppercase tracking-wider border-b border-outline-variant/30 pb-2">
          What to Expect
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs text-on-surface-variant">
          <div>
            <h5 className="font-bold text-tertiary mb-2 uppercase tracking-wide">Club Activities</h5>
            <ul className="space-y-1">
              <li>• Weekly workshops and tutorials</li>
              <li>• Collaborative game projects</li>
              <li>• Game jams and competitions</li>
              <li>• Industry guest speakers</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-primary mb-2 uppercase tracking-wide">Time Commitment</h5>
            <ul className="space-y-1">
              <li>• 4-6 hours per week minimum</li>
              <li>• Regular meeting attendance</li>
              <li>• Project deadlines</li>
              <li>• Optional extra activities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}