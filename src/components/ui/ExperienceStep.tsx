'use client';

import { Control, Controller, FieldErrors } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Code, Gamepad2, FileText, ExternalLink, X } from 'lucide-react';
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
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Technical Experience</h3>
        <p className="text-gray-400">Tell us about your programming skills and project experience</p>
      </div>

      {/* Programming Languages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-medium text-gray-300 mb-3">
          <Code className="w-4 h-4 inline mr-2" />
          Programming Languages * (Select all that apply)
        </label>
        <Controller
          name="experience.programmingLanguages"
          control={control}
          render={({ field }) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {PROGRAMMING_LANGUAGES.map((language) => (
                  <motion.label
                    key={language}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center p-3 rounded-lg border cursor-pointer transition-all
                      ${field.value?.includes(language)
                        ? 'bg-green-600/20 border-green-500 text-green-300'
                        : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:border-gray-500'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={field.value?.includes(language) || false}
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
                    <span className="text-sm font-medium">{language}</span>
                  </motion.label>
                ))}
              </div>
              
              {/* Custom Language Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  placeholder="Add custom language..."
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (customLanguage.trim() && !field.value?.includes(customLanguage.trim())) {
                      field.onChange([...(field.value || []), customLanguage.trim()]);
                      setCustomLanguage('');
                    }
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Add
                </motion.button>
              </div>

              {/* Selected Languages Display */}
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {field.value.map((language) => (
                    <motion.span
                      key={language}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm"
                    >
                      {language}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(field.value?.filter(lang => lang !== language));
                        }}
                        className="ml-2 hover:text-green-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          )}
        />
        {errors?.programmingLanguages && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-400"
          >
            {errors.programmingLanguages.message}
          </motion.p>
        )}
      </motion.div>

      {/* Game Engines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-medium text-gray-300 mb-3">
          <Gamepad2 className="w-4 h-4 inline mr-2" />
          Game Engines & Frameworks (Optional)
        </label>
        <Controller
          name="experience.gameEngines"
          control={control}
          render={({ field }) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {GAME_ENGINES.map((engine) => (
                  <motion.label
                    key={engine}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center p-3 rounded-lg border cursor-pointer transition-all
                      ${field.value?.includes(engine)
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:border-gray-500'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={field.value?.includes(engine) || false}
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
                    <span className="text-sm font-medium">{engine}</span>
                  </motion.label>
                ))}
              </div>
              
              {/* Custom Engine Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customEngine}
                  onChange={(e) => setCustomEngine(e.target.value)}
                  placeholder="Add custom engine/framework..."
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (customEngine.trim() && !field.value?.includes(customEngine.trim())) {
                      field.onChange([...(field.value || []), customEngine.trim()]);
                      setCustomEngine('');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Add
                </motion.button>
              </div>

              {/* Selected Engines Display */}
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {field.value.map((engine) => (
                    <motion.span
                      key={engine}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm"
                    >
                      {engine}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(field.value?.filter(eng => eng !== engine));
                        }}
                        className="ml-2 hover:text-blue-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          )}
        />
      </motion.div>

      {/* Previous Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          Previous Projects & Experience *
        </label>
        <Controller
          name="experience.previousProjects"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={6}
              placeholder="Describe your previous programming projects, game development experience, or any relevant work. Include technologies used, challenges faced, and what you learned..."
              className={`
                w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 resize-none
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                transition-all duration-200
                ${errors?.previousProjects ? 'border-red-500' : 'border-gray-600'}
              `}
            />
          )}
        />
        {errors?.previousProjects && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-400"
          >
            {errors.previousProjects.message}
          </motion.p>
        )}
      </motion.div>

      {/* Portfolio URL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <ExternalLink className="w-4 h-4 inline mr-2" />
          Portfolio/GitHub URL (Optional)
        </label>
        <Controller
          name="experience.portfolioUrl"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="url"
              placeholder="https://github.com/yourusername or https://yourportfolio.com"
              className={`
                w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                transition-all duration-200
                ${errors?.portfolioUrl ? 'border-red-500' : 'border-gray-600'}
              `}
            />
          )}
        />
        {errors?.portfolioUrl && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-400"
          >
            {errors.portfolioUrl.message}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-green-900/20 border border-green-500/20 rounded-lg p-4 mt-6"
      >
        <p className="text-green-300 text-sm">
          <strong>Tip:</strong> Don&apos;t worry if you&apos;re a beginner! We welcome members at all skill levels. 
          Focus on your enthusiasm to learn and any relevant experience, even if it&apos;s from coursework or personal projects.
        </p>
      </motion.div>
    </div>
  );
}