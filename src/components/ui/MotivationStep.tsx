'use client';

import { Control, Controller, FieldErrors } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Heart, Target, Clock } from 'lucide-react';
import { ApplicationFormData, MotivationFormData } from '@/lib/validations/application';

interface MotivationStepProps {
  control: Control<ApplicationFormData>;
  errors?: FieldErrors<MotivationFormData>;
}

export function MotivationStep({ control, errors }: MotivationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Motivation & Goals</h3>
        <p className="text-gray-400">Help us understand your passion and commitment to game development</p>
      </div>

      {/* Why Join */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Heart className="w-4 h-4 inline mr-2" />
          Why do you want to join The Game Forge? *
        </label>
        <Controller
          name="motivation.whyJoin"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <textarea
                {...field}
                rows={5}
                placeholder="Share what draws you to game development and why you want to be part of our community. What excites you about creating games? What do you hope to contribute to the club?"
                className={`
                  w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 resize-none
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  transition-all duration-200
                  ${errors?.whyJoin ? 'border-red-500' : 'border-gray-600'}
                `}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {field.value?.length || 0}/500
              </div>
            </div>
          )}
        />
        {errors?.whyJoin && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-400"
          >
            {errors.whyJoin.message}
          </motion.p>
        )}
      </motion.div>

      {/* Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Target className="w-4 h-4 inline mr-2" />
          What are your goals in game development? *
        </label>
        <Controller
          name="motivation.goals"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <textarea
                {...field}
                rows={5}
                placeholder="Describe your short-term and long-term goals in game development. What skills do you want to develop? What type of games do you want to create? How do you see yourself growing in this field?"
                className={`
                  w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 resize-none
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  transition-all duration-200
                  ${errors?.goals ? 'border-red-500' : 'border-gray-600'}
                `}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {field.value?.length || 0}/500
              </div>
            </div>
          )}
        />
        {errors?.goals && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-400"
          >
            {errors.goals.message}
          </motion.p>
        )}
      </motion.div>

      {/* Availability */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Clock className="w-4 h-4 inline mr-2" />
          Time Commitment & Availability *
        </label>
        <Controller
          name="motivation.availability"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <textarea
                {...field}
                rows={4}
                placeholder="How much time can you dedicate to club activities per week? Are there specific days/times that work best for you? Any scheduling constraints we should know about?"
                className={`
                  w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 resize-none
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  transition-all duration-200
                  ${errors?.availability ? 'border-red-500' : 'border-gray-600'}
                `}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {field.value?.length || 0}/200
              </div>
            </div>
          )}
        />
        {errors?.availability && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-400"
          >
            {errors.availability.message}
          </motion.p>
        )}
      </motion.div>

      {/* Expectations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-lg p-6"
      >
        <h4 className="text-lg font-semibold text-white mb-4">What to Expect</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h5 className="font-medium text-green-400 mb-2">Club Activities</h5>
            <ul className="space-y-1 text-gray-400">
              <li>• Weekly workshops and tutorials</li>
              <li>• Collaborative game projects</li>
              <li>• Game jams and competitions</li>
              <li>• Industry guest speakers</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-400 mb-2">Time Commitment</h5>
            <ul className="space-y-1 text-gray-400">
              <li>• 4-6 hours per week minimum</li>
              <li>• Regular meeting attendance</li>
              <li>• Project deadlines</li>
              <li>• Optional extra activities</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Final Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-green-900/20 border border-green-500/20 rounded-lg p-4"
      >
        <p className="text-green-300 text-sm">
          <strong>Almost there!</strong> Your responses help us understand how to best support your game development journey. 
          We&apos;re excited to potentially welcome you to The Game Forge family!
        </p>
      </motion.div>
    </div>
  );
}