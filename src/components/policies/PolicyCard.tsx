"use client";

import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PolicyCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  index: number;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ title, description, href, icon: Icon, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={href} className="group block h-full">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream h-full transition-all duration-300 hover:shadow-md hover:border-rose/30 hover:translate-y-[-4px] flex flex-col">
          <div className="w-14 h-14 bg-cream rounded-xl flex items-center justify-center text-rose-deep mb-6 group-hover:bg-rose-deep group-hover:text-white transition-colors">
            <Icon size={28} />
          </div>
          <h3 className="font-playfair text-2xl font-bold text-chocolate mb-3">
            {title}
          </h3>
          <p className="text-text-mid text-sm leading-relaxed mb-6 flex-grow">
            {description}
          </p>
          <div className="flex items-center text-rose-deep font-bold text-sm uppercase tracking-widest gap-2">
            Read Policy <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PolicyCard;
