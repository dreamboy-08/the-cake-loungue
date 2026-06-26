"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
}

const PolicyLayout: React.FC<PolicyLayoutProps> = ({ title, lastUpdated, children, breadcrumbs }) => {
  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        {/* Sticky Breadcrumb */}
        <nav className="sticky top-24 z-10 bg-cream/80 backdrop-blur-md py-4 mb-8 rounded-xl border border-cream-dark/50 px-4">
          <ol className="flex items-center flex-wrap gap-2 text-sm">
            <li className="flex items-center">
              <Link href="/" className="text-text-soft hover:text-rose-deep transition-colors flex items-center gap-1">
                <Home size={14} />
                <span>Home</span>
              </Link>
            </li>
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <ChevronRight size={14} className="text-text-soft/50" />
                {item.href ? (
                  <Link href={item.href} className="text-text-soft hover:text-rose-deep transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-rose-deep font-semibold">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Content Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[900px] mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-cream p-8 md:p-12">
            <header className="mb-10 pb-8 border-b border-cream-dark">
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-chocolate mb-4">
                {title}
              </h1>
              <div className="inline-block bg-cream px-4 py-1.5 rounded-full">
                <p className="text-xs font-bold text-text-soft uppercase tracking-widest">
                  Last Updated: {lastUpdated}
                </p>
              </div>
            </header>

            <article className="max-w-none text-text-mid leading-relaxed
              [&>h2]:font-playfair [&>h2]:text-chocolate [&>h2]:text-2xl [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:font-bold
              [&>h3]:font-playfair [&>h3]:text-chocolate [&>h3]:text-xl [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:font-bold
              [&>p]:mb-6
              [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-5
              [&>ul>li]:mb-2
              [&>strong]:text-chocolate [&>strong]:font-bold
            ">
              {children}
            </article>

            <div className="mt-12 pt-8 border-t border-cream-dark">
              <p className="text-sm text-text-soft">
                If you have any questions regarding our policies, please contact us at{' '}
                <a href="mailto:thecakeloungegurgaon@gmail.com" className="text-rose-deep font-bold hover:underline">
                  thecakeloungegurgaon@gmail.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PolicyLayout;
