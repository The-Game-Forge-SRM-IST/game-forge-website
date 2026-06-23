'use client';

import { Control, Controller, FieldErrors } from 'react-hook-form';
import { ApplicationFormData, ExperienceFormData, PROGRAMMING_LANGUAGES, GAME_ENGINES } from '@/lib/validations/application';
import { useState } from 'react';

interface ExperienceStepProps {
  control: Control<ApplicationFormData>;
  errors?: FieldErrors<ExperienceFormData>;
}

export function ExperienceStep({ control, errors }: ExperienceStepProps) {
  const [customLanguage, setCustomLanguage] = useState('');
  const [customEngine, setCustomEngine] = useState('');

  return (
    <div className="space-y-6">
      <div className="text-center mb-8 border-b border-outline-variant/30 pb-4">
        <h3 className="font-sans text-xl font-bold text-on-surface uppercase tracking-tight">
          Step 2: Technical Experience
        </h3>
        <p className="font-mono text-xs text-on-surface-variant mt-1">
          Tell us about your programming and development skills.
        </p>
      </div>

      {/* Programming Languages */}
      <div className="space-y-3">
        <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          Programming Languages * (Select all that apply)
        </label>
        <Controller
          name="experience.programmingLanguages"
          control={control}
          render={({ field }) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {PROGRAMMING_LANGUAGES.map((language) => {
                  const isChecked = field.value?.includes(language) || false;
                  return (
                    <label
                      key={language}
                      className={`
                        font-mono text-xs p-3 border cursor-pointer transition-all duration-150 active:scale-95 flex items-center justify-between
                        ${isChecked
                          ? 'bg-tertiary/10 border-tertiary text-tertiary font-bold'
                          : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary hover:text-white'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const currentValue = field.value || [];
                          if (e.target.checked) {
                            field.onChange([...currentValue, language]);
                          } else {
                            field.onChange(currentValue.filter(lang => lang !== language));
                          }
                        }}
                        className="sr-only"
                      />
                      <span>{language.toUpperCase()}</span>
                      {isChecked && (
                        <span className="material-symbols-outlined text-sm font-bold animate-pulse">check</span>
                      )}
                    </label>
                  );
                })}
              </div>
              
              {/* Custom Language Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  placeholder="e.g. Go, Rust"
                  className="flex-1 bg-surface-container-low border border-outline-variant p-2 text-on-surface font-mono text-xs focus:outline-none focus:border-tertiary"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customLanguage.trim() && !field.value?.includes(customLanguage.trim())) {
                      field.onChange([...(field.value || []), customLanguage.trim()]);
                      setCustomLanguage('');
                    }
                  }}
                  className="px-4 py-2 bg-primary text-black font-mono text-xs font-bold uppercase hover:bg-white active:scale-95 transition-all"
                >
                  ADD
                </button>
              </div>

              {/* Selected Languages Display (redundancy/clean check) */}
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((language) => (
                    <span
                      key={language}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-tertiary/15 border border-tertiary/30 text-tertiary font-mono text-[10px] font-bold"
                    >
                      {language.toUpperCase()}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(field.value?.filter(lang => lang !== language));
                        }}
                        className="hover:text-white font-bold"
                      >
                        [X]
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        />
        {errors?.programmingLanguages && (
          <p role="alert" className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">warning</span>
            {errors.programmingLanguages.message}
          </p>
        )}
      </div>

      {/* Game Engines */}
      <div className="space-y-3">
        <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          Game Engines (Optional)
        </label>
        <Controller
          name="experience.gameEngines"
          control={control}
          render={({ field }) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {GAME_ENGINES.map((engine) => {
                  const isChecked = field.value?.includes(engine) || false;
                  return (
                    <label
                      key={engine}
                      className={`
                        font-mono text-xs p-3 border cursor-pointer transition-all duration-150 active:scale-95 flex items-center justify-between
                        ${isChecked
                          ? 'bg-secondary-container/10 border-secondary-container text-on-secondary-container font-bold'
                          : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary hover:text-white'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const currentValue = field.value || [];
                          if (e.target.checked) {
                            field.onChange([...currentValue, engine]);
                          } else {
                            field.onChange(currentValue.filter(eng => eng !== engine));
                          }
                        }}
                        className="sr-only"
                      />
                      <span>{engine.toUpperCase()}</span>
                      {isChecked && (
                        <span className="material-symbols-outlined text-sm font-bold text-secondary">check</span>
                      )}
                    </label>
                  );
                })}
              </div>
              
              {/* Custom Engine Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customEngine}
                  onChange={(e) => setCustomEngine(e.target.value)}
                  placeholder="e.g. Godot, Unreal"
                  className="flex-1 bg-surface-container-low border border-outline-variant p-2 text-on-surface font-mono text-xs focus:outline-none focus:border-tertiary"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customEngine.trim() && !field.value?.includes(customEngine.trim())) {
                      field.onChange([...(field.value || []), customEngine.trim()]);
                      setCustomEngine('');
                    }
                  }}
                  className="px-4 py-2 bg-primary text-black font-mono text-xs font-bold uppercase hover:bg-white active:scale-95 transition-all"
                >
                  ADD
                </button>
              </div>

              {/* Selected Engines Display */}
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((engine) => (
                    <span
                      key={engine}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-secondary-container/10 border border-secondary-container/30 text-on-secondary-container font-mono text-[10px] font-bold"
                    >
                      {engine.toUpperCase()}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(field.value?.filter(eng => eng !== engine));
                        }}
                        className="hover:text-white font-bold"
                      >
                        [X]
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        />
      </div>

      {/* Previous Projects */}
      <div className="space-y-2">
        <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          Previous Projects *
        </label>
        <Controller
          name="experience.previousProjects"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={4}
              placeholder="Describe your previous programming projects, game development experience, or relevant coursework. Include technologies, architecture, and what challenges you resolved..."
              className={`
                w-full bg-surface-container-low border p-3 text-on-surface font-mono text-xs placeholder:text-outline-variant resize-none
                focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all
                ${errors?.previousProjects ? 'border-secondary' : 'border-outline-variant'}
              `}
            />
          )}
        />
        {errors?.previousProjects && (
          <p role="alert" className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">warning</span>
            {errors.previousProjects.message}
          </p>
        )}
      </div>

      {/* Portfolio URL */}
      <div className="space-y-2">
        <label className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          Portfolio / GitHub URL (Optional)
        </label>
        <Controller
          name="experience.portfolioUrl"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="url"
              placeholder="https://github.com/..."
              className={`
                w-full bg-surface-container-low border p-3 text-on-surface font-mono text-xs placeholder:text-outline-variant
                focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all
                ${errors?.portfolioUrl ? 'border-secondary' : 'border-outline-variant'}
              `}
            />
          )}
        />
        {errors?.portfolioUrl && (
          <p role="alert" className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">warning</span>
            {errors.portfolioUrl.message}
          </p>
        )}
      </div>
    </div>
  );
}