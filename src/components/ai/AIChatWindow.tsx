"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Minus, MessageSquare, Sparkles, Cake, Info, Truck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIAvatar from './AIAvatar';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChatWindow: React.FC<AIChatWindowProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: '1',
            text: "👋 Hi! I'm Cake Lounge AI.\n\nI'm here to help you choose the perfect cake, customize your dream cake, answer your questions, and make every celebration sweeter.",
            sender: 'ai',
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "That sounds like a wonderful celebration! I'm currently in 'Consultant Mode'. For specific recommendations, you can ask about flavors, sizes, or delivery options.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const capabilities = [
    { icon: <Sparkles size={14} />, label: 'Recommendations', href: '/ai-recommendations' },
    { icon: <Cake size={14} />, label: 'Custom Cake Help', href: '/custom-cake' },
    { icon: <Info size={14} />, label: 'Product Suggestions', href: '/menu' },
    { icon: <Truck size={14} />, label: 'Delivery Info', href: '/policies/shipping-delivery' },
    { icon: <HelpCircle size={14} />, label: 'FAQs', href: '/#contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-[32px] shadow-2xl border border-cream overflow-hidden z-[999] flex flex-col"
        >
          {/* Header */}
          <div className="bg-chocolate p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-1">
                <AIAvatar size="sm" />
              </div>
              <div>
                <h3 className="font-playfair font-bold text-lg leading-tight">Cake Lounge AI</h3>
                <p className="text-[10px] text-blush/80 uppercase tracking-widest font-medium">Your Celebration, Our AI Magic</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Minus size={20} />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Capabilities Horizontal Scroll */}
          <div className="bg-cream/50 border-b border-cream py-3 px-4 flex gap-2 overflow-x-auto no-scrollbar">
            {capabilities.map((cap, i) => (
              <Link
                key={i}
                href={cap.href}
                className="flex items-center gap-1.5 whitespace-nowrap bg-white px-3 py-1.5 rounded-full border border-cream shadow-sm text-[11px] font-bold text-chocolate hover:border-rose transition-colors"
                onClick={onClose}
              >
                <span className="text-rose-deep">{cap.icon}</span>
                {cap.label}
              </Link>
            ))}
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-cream/20">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-white border border-cream flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <AIAvatar size="sm" className="scale-75" />
                    </div>
                  )}
                  <div className={`p-4 rounded-[22px] text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-rose-deep text-white rounded-tr-none'
                      : 'bg-white text-chocolate rounded-tl-none border border-cream'
                  }`}>
                    {msg.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i !== msg.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-cream flex items-center justify-center overflow-hidden">
                    <AIAvatar size="sm" className="scale-75" />
                  </div>
                  <div className="bg-white border border-cream px-4 py-3 rounded-[22px] rounded-tl-none shadow-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-rose-deep/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-rose-deep/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-rose-deep/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-4 bg-white border-t border-cream">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask me anything about cakes..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="w-full pl-4 pr-12 py-3 bg-cream/30 border border-cream rounded-full text-sm focus:outline-none focus:border-rose transition-colors placeholder:text-text-soft"
              />
              <button
                onClick={handleSend}
                className="absolute right-1.5 p-2 bg-rose-deep text-white rounded-full hover:bg-brown transition-colors shadow-md active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[9px] text-center text-text-soft mt-3 uppercase tracking-tighter font-bold">
              Powered by Cake Lounge AI — Your Digital Cake Consultant
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatWindow;
