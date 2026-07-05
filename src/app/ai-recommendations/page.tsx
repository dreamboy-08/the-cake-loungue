"use client";

import React, { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import BackButton from '@/components/BackButton';
import AIAvatar from '@/components/ai/AIAvatar';
import ProductCard from '@/components/ProductCard';
import { products } from '@/constants/products';
import { Sparkles, Heart, Gift, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const AIRecommendationsPage = () => {
  const [selectedVibe, setSelectedVibe] = useState('Romantic');

  const vibes = [
    { id: 'Romantic', icon: <Heart size={18} />, label: 'Romantic Evening' },
    { id: 'Celebration', icon: <Star size={18} />, label: 'Grand Celebration' },
    { id: 'Corporate', icon: <Users size={18} />, label: 'Office Party' },
    { id: 'Gift', icon: <Gift size={18} />, label: 'Perfect Gift' },
  ];

  const recommendedProducts = products.slice(0, 4); // Simulate recommendation logic

  return (
    <PageWrapper>
      <div className="container mx-auto px-6">
        <BackButton />

        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-rose-deep/20 rounded-full blur-3xl" />
              <div className="bg-white p-8 rounded-full shadow-2xl relative z-10 border border-cream">
                <AIAvatar size="xl" />
              </div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <Sparkles size={24} className="text-rose-deep" />
              <span className="text-sm font-black text-rose-deep uppercase tracking-[0.2em]">Curated by Cake Lounge AI</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-chocolate mb-6">
              Handpicked <br /> <span className="text-rose-deep italic">Just For You</span>
            </h1>
            <p className="text-lg text-text-soft max-w-xl">
              I&apos;ve analyzed our entire collection to find the perfect matches for your unique taste and occasion.
              Simply tell me the &ldquo;vibe&rdquo; you&apos;re looking for today!
            </p>
          </div>
        </div>

        {/* Vibe Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {vibes.map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => setSelectedVibe(vibe.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-all duration-300 ${
                selectedVibe === vibe.id
                  ? 'bg-chocolate text-white shadow-xl scale-105'
                  : 'bg-white text-chocolate border border-cream hover:border-rose shadow-sm'
              }`}
            >
              <span className={selectedVibe === vibe.id ? 'text-blush' : 'text-rose-deep'}>{vibe.icon}</span>
              {vibe.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-12 mb-20">
          <div className="flex items-center justify-between border-b border-cream pb-6">
            <h2 className="text-2xl font-playfair font-bold text-chocolate">
              My Top Picks for <span className="text-rose-deep">{selectedVibe}</span>
            </h2>
            <p className="text-sm text-text-soft font-bold uppercase tracking-widest">{recommendedProducts.length} Results</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendedProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="bg-chocolate rounded-[48px] p-8 md:p-16 text-white overflow-hidden relative mb-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-deep/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h3 className="text-3xl md:text-4xl font-playfair font-bold mb-6 italic text-blush">AI Baker&apos;s Insight</h3>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                &ldquo;For a {selectedVibe} vibe, I recommend looking at cakes with subtle floral notes or dark chocolate finishes.
                These tend to create the strongest emotional connection and lasting memories for this specific occasion.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-blush/30 p-1">
                  <AIAvatar size="sm" />
                </div>
                <div>
                  <p className="font-bold">Cake Lounge AI</p>
                  <p className="text-xs text-blush/60 uppercase tracking-widest font-medium">Head AI Consultant</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 bg-white/5 backdrop-blur-md rounded-[32px] p-8 border border-white/10">
              <p className="text-xs font-black uppercase tracking-widest text-blush mb-6 text-center">AI Confidence Score</p>
              <div className="flex flex-col items-center gap-2">
                 <div className="text-6xl font-black text-white">98<span className="text-2xl text-blush">%</span></div>
                 <div className="w-full h-2 bg-white/10 rounded-full mt-4">
                   <div className="w-[98%] h-full bg-gradient-to-r from-rose-deep to-blush rounded-full" />
                 </div>
                 <p className="text-[10px] text-white/40 mt-4 text-center">BASED ON CUSTOMER PREFERENCES & RECENT TRENDS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AIRecommendationsPage;
