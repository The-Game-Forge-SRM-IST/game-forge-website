'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Instagram,
  Linkedin,
  Users
} from 'lucide-react';
import { contactFormSchema, type ContactFormData, CONTACT_TYPES } from '@/lib/validations/contact';

// === Configuration from environment variables ===
const ENDPOINT = process.env.NEXT_PUBLIC_GOOGLE_SCRIPTS_URL;
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'partial' | 'error';

const contactInfo = {
  email: 'thegameforge@srmist.edu.in',
  location: {
    name: 'SRM Institute of Science and Technology',
    address: 'Kattankulathur, Tamil Nadu 603203',
    campus: 'KTR Campus'
  },
  socialLinks: {
    linkedin: 'https://www.linkedin.com/company/105910279/',
    instagram: 'https://www.instagram.com/the_game_forge/'
  }
};

export default function ContactSection() {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      type: 'general'
    }
  });

  const submitToGoogleSheets = async (data: ContactFormData): Promise<boolean> => {
    try {
      if (!ENDPOINT) {
        console.error("Google Scripts URL not configured");
        return false;
      }

      const payload = {
        Name: data.name,
        Email: data.email,
        ContactType: CONTACT_TYPES.find(t => t.value === data.type)?.label || data.type,
        Subject: data.subject,
        Message: data.message,
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

      return true; // Assume success with no-cors
    } catch (error) {
      console.error("Google Sheets submission error:", error);
      return false;
    }
  };

  const submitToEmailJS = async (data: ContactFormData): Promise<boolean> => {
    try {
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.error("EmailJS configuration missing");
        return false;
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: data.name,
          email: data.email,
          contact_type: CONTACT_TYPES.find(t => t.value === data.type)?.label || data.type,
          subject: data.subject,
          message: data.message,
          time: new Date().toLocaleString(),
        },
        EMAILJS_PUBLIC_KEY
      );
      return true;
    } catch (error) {
      console.error("EmailJS submission error:", error);
      return false;
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setSubmissionStatus('submitting');
    setSubmitMessage('');
    
    try {
      // Submit to both services simultaneously
      const [sheetsSuccess, emailSuccess] = await Promise.all([
        submitToGoogleSheets(data),
        submitToEmailJS(data)
      ]);

      console.log('Submission results:', { sheetsSuccess, emailSuccess });

      // Determine status based on results
      if (sheetsSuccess && emailSuccess) {
        setSubmissionStatus('success');
        setSubmitMessage('We have received your message and will contact you shortly!');
      } else if (sheetsSuccess && !emailSuccess) {
        setSubmissionStatus('partial');
        setSubmitMessage('We have received your message but it would take some time to reply due to email service issues.');
      } else if (!sheetsSuccess && emailSuccess) {
        setSubmissionStatus('partial');
        setSubmitMessage('Your message was sent via email, but there was an issue with our database. We will still get back to you shortly.');
      } else {
        setSubmissionStatus('error');
        setSubmitMessage('This service is not available right now. Please try again later or contact us directly via email.');
      }

      // Reset form only on success or partial success
      if (sheetsSuccess || emailSuccess) {
        reset();
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmissionStatus('error');
      setSubmitMessage('This service is not available right now. Please try again later or contact us directly via email.');
    }
  };

  const getStatusIcon = () => {
    switch (submissionStatus) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const getStatusStyles = () => {
    switch (submissionStatus) {
      case 'success':
        return 'p-4 bg-green-900/20 border border-green-500/20 rounded-lg flex items-center';
      case 'partial':
        return 'p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg flex items-center';
      case 'error':
        return 'p-4 bg-red-900/20 border border-red-500/20 rounded-lg flex items-center';
      default:
        return '';
    }
  };

  const getStatusTextColor = () => {
    switch (submissionStatus) {
      case 'success':
        return 'text-green-300';
      case 'partial':
        return 'text-yellow-300';
      case 'error':
        return 'text-red-300';
      default:
        return '';
    }
  };

  return (
    <section id="contact" className="min-h-screen bg-gradient-to-br from-blue-900/20 via-gray-900 to-green-900/20 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions about The Game Forge? Want to collaborate or join our community? 
              We&apos;d love to hear from you!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                
                {/* Email */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Email</h4>
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Location</h4>
                    <p className="text-gray-300">
                      {contactInfo.location.name}<br />
                      {contactInfo.location.address}<br />
                      <span className="text-green-400">{contactInfo.location.campus}</span>
                    </p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-3">Follow Us</h4>
                    <div className="flex space-x-4">
                      <a
                        href={contactInfo.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center hover:bg-blue-600/30 transition-colors group"
                      >
                        <Linkedin className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      </a>
                      <a
                        href={contactInfo.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center hover:bg-pink-600/30 transition-colors group"
                      >
                        <Instagram className="w-5 h-5 text-pink-400 group-hover:text-pink-300" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Contact Type */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Type *
                    </label>
                    <select
                      {...register('type')}
                      id="type"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {CONTACT_TYPES.map((type) => (
                        <option key={type.value} value={type.value} className="bg-gray-700">
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-400">{errors.type.message}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      {...register('subject')}
                      type="text"
                      id="subject"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="What's this about?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-400">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      {...register('message')}
                      id="message"
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Status Messages */}
                  {submissionStatus !== 'idle' && submissionStatus !== 'submitting' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={getStatusStyles()}
                    >
                      {getStatusIcon()}
                      <p className={getStatusTextColor()}>{submitMessage}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={submissionStatus === 'submitting' || !isValid}
                    whileHover={submissionStatus !== 'submitting' && isValid ? { scale: 1.02 } : {}}
                    whileTap={submissionStatus !== 'submitting' && isValid ? { scale: 0.98 } : {}}
                    className={`
                      w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all
                      ${submissionStatus === 'submitting' || !isValid
                        ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }
                    `}
                  >
                    {submissionStatus === 'submitting' ? (
                      <>
                        <div className="w-5 h-5 mr-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}