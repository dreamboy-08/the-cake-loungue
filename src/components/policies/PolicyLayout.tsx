"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';
import { CONTACT_INFO } from '@/constants/contact';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PolicyLayoutProps {
  title: string;
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
}

const PolicyLayout: React.FC<PolicyLayoutProps> = ({ title, children, breadcrumbs }) => {
  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-[900px] mx-auto mb-8">
          <BackButton />

          {/* Premium Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="sticky top-24 z-30 inline-flex items-center bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-cream shadow-sm mb-4"
          >
            <ol className="flex items-center flex-wrap gap-2 text-sm">
              <li className="flex items-center">
                <Link href="/" className="text-text-soft hover:text-rose-deep transition-all duration-300 flex items-center gap-1 group">
                  <Home size={14} className="group-hover:scale-110" />
                  <span className="font-medium">Home</span>
                </Link>
              </li>
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-text-soft/30" />
                  {item.href ? (
                    <Link href={item.href} className="text-text-soft hover:text-rose-deep transition-all duration-300 font-medium">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-rose-deep font-bold">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>
        </div>

        {/* Content Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-[900px] mx-auto"
        >
          <div className="bg-white rounded-[32px] shadow-lg border border-cream overflow-hidden">
            <header className="bg-cream/30 p-8 md:p-12 border-b border-cream-dark">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-playfair text-4xl md:text-5xl font-bold text-chocolate leading-tight"
              >
                {title}
              </motion.h1>
            </header>

            <article className="p-8 md:p-12 max-w-none text-text-mid leading-relaxed
              [&>h2]:font-playfair [&>h2]:text-chocolate [&>h2]:text-2xl [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:font-bold
              [&>h3]:font-playfair [&>h3]:text-chocolate [&>h3]:text-xl [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:font-bold
              [&>p]:mb-6
              [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-5
              [&>ul>li]:mb-2
              [&>strong]:text-chocolate [&>strong]:font-bold
            ">
              {children}
            </article>

            <footer className="bg-cream/10 p-8 md:p-10 border-t border-cream-dark text-center">
              <p className="text-sm text-text-soft mb-2">
                Have questions about our {title.toLowerCase()}?
              </p>
              <p className="text-sm">
                Email us at{' '}
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-rose-deep font-bold hover:underline underline-offset-4">
                  {CONTACT_INFO.email}
                </a>
              </p>
            </footer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PolicyLayout;
