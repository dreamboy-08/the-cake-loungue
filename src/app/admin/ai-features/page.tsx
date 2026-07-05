"use client";

import React from 'react';
import { Sparkles, Brain, BarChart3, MessageSquare, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import AIAvatar from '@/components/ai/AIAvatar';

const AdminAIFeatures = () => {
  const features = [
    {
      title: "Smart Inventory Prediction",
      desc: "AI predicts upcoming demand based on local events and trends.",
      status: "Active",
      icon: <Brain className="text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      title: "Auto-Review Response",
      desc: "Automatically draft professional, friendly replies to customer reviews.",
      status: "Enabled",
      icon: <MessageSquare className="text-green-500" />,
      color: "bg-green-50"
    },
    {
      title: "Trend Analysis",
      desc: "AI identifies rising popularity in specific flavors or designs.",
      status: "Analyzing",
      icon: <TrendingUp className="text-purple-500" />,
      color: "bg-purple-50"
    },
    {
      title: "Fraud Detection",
      desc: "Real-time AI monitoring for suspicious order patterns.",
      status: "Shielded",
      icon: <ShieldCheck className="text-red-500" />,
      color: "bg-red-50"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-cream">
            <AIAvatar size="md" />
          </div>
          <div>
            <h1 className="text-3xl font-playfair font-bold text-chocolate">AI Command Centre</h1>
            <p className="text-gray-500 mt-1">Manage and monitor Cake Lounge AI performance.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-chocolate text-white px-6 py-3 rounded-2xl shadow-lg shadow-chocolate/20">
          <Zap size={18} className="text-blush animate-pulse" />
          <span className="font-bold text-sm">System Healthy</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className={`${f.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
              {f.icon}
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-chocolate">{f.title}</h3>
              <span className="text-[10px] font-black uppercase px-2 py-1 bg-gray-100 rounded-md text-gray-500">{f.status}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-chocolate flex items-center gap-3">
              <BarChart3 className="text-rose-deep" />
              AI Impact Analysis
            </h2>
            <select className="bg-gray-50 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {[40, 60, 45, 90, 65, 85, 70, 95, 80, 100, 90, 110].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div
                  className="w-full bg-cream-dark group-hover:bg-rose-deep transition-all rounded-t-lg relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-chocolate text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    +{h}% Conversions
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2">
            <span className="text-[10px] font-bold text-gray-400">JAN</span>
            <span className="text-[10px] font-bold text-gray-400">JUN</span>
            <span className="text-[10px] font-bold text-gray-400">DEC</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-chocolate to-brown p-8 rounded-[40px] text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16" />

          <div>
            <Sparkles className="text-blush mb-6" size={32} />
            <h2 className="text-2xl font-playfair font-bold mb-4 italic text-blush">AI Consultant Status</h2>
            <p className="text-sm text-white/70 leading-relaxed mb-8">
              Cake Lounge AI is currently handling 84% of customer inquiries with a 98% satisfaction rate.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Customer Satisfaction</span>
              <span className="text-blush">98%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full">
              <div className="w-[98%] h-full bg-blush rounded-full" />
            </div>
            <button className="w-full mt-6 bg-white text-chocolate py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-blush transition-all">
              View Insights Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAIFeatures;
