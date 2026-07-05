"use client";

import React, { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import BackButton from '@/components/BackButton';
import AIAvatar from '@/components/ai/AIAvatar';
import { Sparkles, Wand2, RefreshCw, Send, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIGeneratorPage = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult(null);

    // Simulate AI Generation
    setTimeout(() => {
      setResult({
        title: "Dreamy Lavender Velvet Cake",
        description: "A stunning multi-layered velvet cake with delicate lavender-infused cream cheese frosting, topped with hand-sculpted sugar flowers and gold leaf accents.",
        flavors: ["Lavender", "Vanilla Velvet", "Honey Cream"],
        estimatedPrice: "₹2,499",
        suggestion: "Perfect for an elegant garden birthday or a sophisticated anniversary."
      });
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-6">
        <BackButton />

        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block p-4 bg-white rounded-full shadow-xl mb-8 border border-cream">
            <AIAvatar size="xl" />
          </div>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-chocolate mb-4">
            AI <span className="text-rose-deep">Cake Generator</span>
          </h1>
          <p className="text-lg text-text-soft max-w-2xl mx-auto">
            Describe your dream celebration, your favorite flavors, or a specific theme,
            and our AI will design a unique cake concept just for you.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Input Section */}
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-cream relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose/5 rounded-full blur-3xl -mr-32 -mt-32" />

            <div className="relative z-10">
              <label className="block text-chocolate font-bold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-rose-deep" />
                What kind of cake are you dreaming of?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A three-tier vintage wedding cake with edible pearls, pastel pink roses, and a lemon-blueberry flavor..."
                className="w-full h-40 p-6 bg-cream/30 border border-cream rounded-[28px] text-lg focus:outline-none focus:border-rose transition-all resize-none placeholder:text-text-soft/50"
              />

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full group flex items-center justify-center gap-3 bg-chocolate text-white px-8 py-5 rounded-full font-bold text-lg shadow-lg hover:bg-rose-deep transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={24} className="animate-spin" />
                      Designing Your Cake...
                    </>
                  ) : (
                    <>
                      <Wand2 size={24} className="group-hover:rotate-12 transition-transform" />
                      Generate Concept
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border-4 border-rose/20 overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-deep via-blush to-rose-deep" />

                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-rose-deep/10 p-2 rounded-full">
                        <Sparkles size={20} className="text-rose-deep" />
                      </div>
                      <span className="text-xs font-black text-rose-deep uppercase tracking-widest">AI Generated Design</span>
                    </div>
                    <h2 className="text-3xl font-playfair font-bold text-chocolate mb-4">{result.title}</h2>
                    <p className="text-text-soft leading-relaxed mb-8">{result.description}</p>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Flavor Palette</p>
                        <div className="flex flex-wrap gap-2">
                          {result.flavors.map((f: string) => (
                            <span key={f} className="px-3 py-1 bg-cream rounded-full text-xs font-bold text-chocolate">{f}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Estimated Price</p>
                        <p className="text-xl font-black text-rose-deep">{result.estimatedPrice}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-64">
                    <div className="aspect-square bg-cream-dark rounded-[32px] flex flex-col items-center justify-center text-text-soft/40 border-2 border-dashed border-cream gap-4">
                      <ImageIcon size={48} />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Visual Concept Rendering coming soon</p>
                    </div>
                    <button className="w-full mt-6 flex items-center justify-center gap-2 bg-rose-deep text-white py-4 rounded-2xl font-bold text-sm shadow-md hover:bg-chocolate transition-all">
                      <Send size={18} />
                      Send to Designer
                    </button>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-cream rounded-3xl border border-rose/10 italic text-sm text-chocolate/80 text-center">
                  &ldquo;{result.suggestion}&rdquo;
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-20 text-center pb-20">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Trusted by thousands of celebrations</p>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
             <span className="font-playfair text-2xl font-bold">VOGUE</span>
             <span className="font-playfair text-2xl font-bold">BAZAAR</span>
             <span className="font-playfair text-2xl font-bold">ELLE</span>
             <span className="font-playfair text-2xl font-bold">BRIDES</span>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AIGeneratorPage;
