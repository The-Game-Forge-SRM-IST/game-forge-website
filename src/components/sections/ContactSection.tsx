'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import emailjs from '@emailjs/browser';
import { contactFormSchema, type ContactFormData, CONTACT_TYPES } from '@/lib/validations/contact';

// === Configuration from environment variables ===
const ENDPOINT = process.env.NEXT_PUBLIC_GOOGLE_SCRIPTS_URL || "https://script.google.com/macros/s/AKfycbxO9ZF19tr8TfxJy9CXkYM28cGc4uP9ZkQX16Pjk_CAmKKeEVDq1_N7HT9F4R2FLlpt/exec";
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'partial' | 'error';

const contactInfo = {
  email: 'thegameforge00@gmail.com',
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

      return true;
    } catch (error) {
      console.error("Google Sheets submission error:", error);
      return false;
    }
  };

  const submitToEmailJS = async (data: ContactFormData): Promise<boolean> => {
    try {
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.warn("EmailJS configuration missing, skipping email dispatch");
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
      // Submit to Google Sheets and EmailJS
      const sheetsSuccess = await submitToGoogleSheets(data);
      const emailSuccess = await submitToEmailJS(data);

      if (sheetsSuccess && (emailSuccess || !EMAILJS_SERVICE_ID)) {
        setSubmissionStatus('success');
        setSubmitMessage('COMM_LINK_ESTABLISHED: Message has been logged in our databases.');
        reset();
      } else if (sheetsSuccess && !emailSuccess) {
        setSubmissionStatus('partial');
        setSubmitMessage('LOGGED: Message recorded in database but email dispatch failed.');
        reset();
      } else if (!sheetsSuccess && emailSuccess) {
        setSubmissionStatus('partial');
        setSubmitMessage('DISPATCHED: Message sent via mail. Database sync pending.');
        reset();
      } else {
        setSubmissionStatus('error');
        setSubmitMessage('TRANSMISSION_FAILED: Re-verify link parameters and retry.');
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmissionStatus('error');
      setSubmitMessage('TRANSMISSION_FAILED: Check local link connection.');
    }
  };

  return (
    <section id="contact" className="py-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full">
      <div className="mb-16 border-b border-outline-variant/30 pb-8">
        <h2 className="font-sans text-4xl md:text-5xl font-bold text-on-surface uppercase tracking-tight">
          GET_IN_TOUCH
        </h2>
        <p className="font-mono text-xs md:text-sm text-on-surface-variant mt-2 leading-relaxed">
          Open communication channels to the conclave. Report bugs, establish partnerships, or request clearance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Technical Contact Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="forge-border bg-surface-container-low p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-2 right-2 flex gap-1">
              <div className="rivet" />
              <div className="rivet" />
            </div>

            <h3 className="font-sans text-lg font-bold text-on-surface uppercase mb-8 border-b border-outline-variant/30 pb-2">
              STATION_COORDINATES
            </h3>
            
            {/* Email */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 border border-outline-variant/50 bg-surface-container flex items-center justify-center flex-shrink-0 text-primary">
                <span className="material-symbols-outlined text-2xl">mail</span>
              </div>
              <div className="font-mono">
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Email Connection</h4>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-xs text-primary hover:text-white transition-colors"
                >
                  {contactInfo.email.toUpperCase()}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 border border-outline-variant/50 bg-surface-container flex items-center justify-center flex-shrink-0 text-tertiary">
                <span className="material-symbols-outlined text-2xl">factory</span>
              </div>
              <div className="font-mono text-xs text-on-surface-variant">
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Foundry Address</h4>
                <p className="leading-relaxed">
                  {contactInfo.location.name.toUpperCase()}<br />
                  {contactInfo.location.address.toUpperCase()}<br />
                  <span className="text-tertiary font-bold">{contactInfo.location.campus.toUpperCase()}</span>
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 border border-outline-variant/50 bg-surface-container flex items-center justify-center flex-shrink-0 text-secondary">
                <span className="material-symbols-outlined text-2xl">groups</span>
              </div>
              <div className="font-mono">
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Comms Array</h4>
                <div className="flex gap-2">
                  <a
                    href={contactInfo.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-outline-variant bg-surface flex items-center justify-center text-outline hover:border-primary hover:text-white hover:-translate-y-0.5 active:scale-95 transition-all font-bold text-xs"
                    title="LinkedIn"
                  >
                    LN
                  </a>
                  <a
                    href={contactInfo.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-outline-variant bg-surface flex items-center justify-center text-outline hover:border-secondary hover:text-white hover:-translate-y-0.5 active:scale-95 transition-all font-bold text-xs"
                    title="Instagram"
                  >
                    IG
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="forge-border bg-surface-container p-6 sm:p-8 lg:p-12 relative overflow-hidden shadow-2xl">
            {/* Form decorative background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 90% 90%, #91d78a 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            <h3 className="font-sans text-lg font-bold text-on-surface uppercase mb-6 relative z-10">
              TRANSMIT_INQUIRY
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Sender Identity *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-surface font-mono text-xs placeholder:text-outline-variant focus:outline-none focus:border-tertiary"
                  placeholder="FULL_NAME"
                />
                {errors.name && (
                  <p className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Return Comm Link *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-surface font-mono text-xs placeholder:text-outline-variant focus:outline-none focus:border-tertiary"
                  placeholder="EMAIL_ADDRESS"
                />
                {errors.email && (
                  <p className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Contact Type */}
              <div className="space-y-2">
                <label htmlFor="type" className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Signal Frequency *
                </label>
                <select
                  {...register('type')}
                  id="type"
                  className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-surface font-mono text-xs appearance-none focus:outline-none focus:border-tertiary"
                >
                  {CONTACT_TYPES.map((type) => (
                    <option key={type.value} value={type.value} className="bg-surface-container-high">
                      {type.label.toUpperCase()}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="subject" className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Signal Subject *
                </label>
                <input
                  {...register('subject')}
                  type="text"
                  id="subject"
                  className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-surface font-mono text-xs placeholder:text-outline-variant focus:outline-none focus:border-tertiary"
                  placeholder="SUBJECT_HEADER"
                />
                {errors.subject && (
                  <p className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="block font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Signal Payload *
                </label>
                <textarea
                  {...register('message')}
                  id="message"
                  rows={4}
                  className="w-full bg-surface-container-low border border-outline-variant p-3 text-on-surface font-mono text-xs placeholder:text-outline-variant resize-none focus:outline-none focus:border-tertiary"
                  placeholder="ENTER_PAYLOAD_DATA..."
                />
                {errors.message && (
                  <p className="mt-1 font-mono text-[11px] text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Status Banner */}
              {submissionStatus !== 'idle' && submissionStatus !== 'submitting' && (
                <div className={`p-4 font-mono text-xs flex items-start gap-2 border ${
                  submissionStatus === 'success'
                    ? 'bg-tertiary/5 border-tertiary text-tertiary'
                    : submissionStatus === 'partial'
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-secondary/5 border-secondary text-secondary'
                }`}>
                  <span className="material-symbols-outlined text-sm mt-0.5">
                    {submissionStatus === 'success' ? 'check_circle' : 'warning'}
                  </span>
                  <p>{submitMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submissionStatus === 'submitting' || !isValid}
                className={`
                  w-full py-4 font-mono text-xs font-bold uppercase active:scale-[0.98] transition-all flex items-center justify-center gap-2
                  ${submissionStatus === 'submitting' || !isValid
                    ? 'bg-outline-variant/40 text-outline-variant/40 cursor-not-allowed border border-outline-variant/10'
                    : 'bg-secondary text-white hover:brightness-110 shadow-[0_0_15px_rgba(172,1,44,0.3)]'
                  }
                `}
              >
                {submissionStatus === 'submitting' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    TRANSMITTING_PAYLOAD...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">send</span>
                    TRANSMIT_SIGNAL
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}