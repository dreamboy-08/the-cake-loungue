"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { homepageContentService } from '@/utils/adminService';
import { HomepageContent } from '@/types/admin';
import { ArrowLeft, Save, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

const WebsiteContentPage = () => {
  const { user, canManageContent, loading } = useAuth();
  const router = useRouter();
  const [homepageContent, setHomepageContent] = useState<HomepageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'featured' | 'testimonials' | 'sections'>('hero');

  useEffect(() => {
    if (!loading && !canManageContent) {
      router.push('/admin');
    }
  }, [loading, canManageContent, router]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await homepageContentService.get();
        setHomepageContent(content || {
          hero: {
            images: [],
            mainText: '',
            subText: '',
            ctaButtonText: 'Order Now',
            ctaButtonLink: '/shop',
            autoPlayInterval: 5000,
          },
          sections: [
            { id: 'hero', name: 'Hero Banner', isVisible: true, displayOrder: 0 },
            { id: 'featured-categories', name: 'Featured Categories', isVisible: true, displayOrder: 1 },
            { id: 'featured-products', name: 'Featured Products', isVisible: true, displayOrder: 2 },
            { id: 'testimonials', name: 'Testimonials', isVisible: true, displayOrder: 3 },
            { id: 'about', name: 'About Section', isVisible: true, displayOrder: 4 },
            { id: 'contact', name: 'Contact Section', isVisible: true, displayOrder: 5 },
          ],
        });
      } catch (error) {
        console.error('Error fetching homepage content:', error);
        setSaveMessage({ type: 'error', message: 'Failed to load content' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async () => {
    if (!homepageContent) return;
    setIsSaving(true);
    try {
      await homepageContentService.update(homepageContent);
      setSaveMessage({ type: 'success', message: 'Homepage content saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setSaveMessage({ type: 'error', message: 'Failed to save content' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-rose-deep" size={48} />
      </div>
    );
  }

  if (!canManageContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="text-red-500" size={48} />
        <p className="text-lg font-semibold">Access Denied</p>
        <Link href="/admin" className="text-rose-deep hover:underline">Go back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">Website Content</h1>
          <p className="text-gray-500 mt-1">Manage all homepage content without coding</p>
        </div>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-xl flex gap-3 ${saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <AlertCircle size={20} />
          <p>{saveMessage.message}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'hero' as const, label: 'Hero Banner' },
          { id: 'featured' as const, label: 'Featured Items' },
          { id: 'testimonials' as const, label: 'Testimonials' },
          { id: 'sections' as const, label: 'Sections' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-rose-deep text-rose-deep'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      {activeTab === 'hero' && homepageContent?.hero && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Main Heading</label>
            <input
              type="text"
              value={homepageContent.hero.mainText || ''}
              onChange={(e) => setHomepageContent({
                ...homepageContent,
                hero: { ...homepageContent.hero!, mainText: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-deep outline-none"
              placeholder="Enter main heading text"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Sub Heading</label>
            <input
              type="text"
              value={homepageContent.hero.subText || ''}
              onChange={(e) => setHomepageContent({
                ...homepageContent,
                hero: { ...homepageContent.hero!, subText: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-deep outline-none"
              placeholder="Enter sub heading text"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">CTA Button Text</label>
              <input
                type="text"
                value={homepageContent.hero.ctaButtonText || ''}
                onChange={(e) => setHomepageContent({
                  ...homepageContent,
                  hero: { ...homepageContent.hero!, ctaButtonText: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-deep outline-none"
                placeholder="Button text"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">CTA Button Link</label>
              <input
                type="text"
                value={homepageContent.hero.ctaButtonLink || ''}
                onChange={(e) => setHomepageContent({
                  ...homepageContent,
                  hero: { ...homepageContent.hero!, ctaButtonLink: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-deep outline-none"
                placeholder="/shop"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Autoplay Interval (ms)</label>
            <input
              type="number"
              value={homepageContent.hero.autoPlayInterval || 5000}
              onChange={(e) => setHomepageContent({
                ...homepageContent,
                hero: { ...homepageContent.hero!, autoPlayInterval: parseInt(e.target.value) }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-deep outline-none"
              min="1000"
              step="1000"
            />
          </div>
        </div>
      )}

      {/* Featured Section */}
      {activeTab === 'featured' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Featured items management coming soon</p>
        </div>
      )}

      {/* Testimonials Section */}
      {activeTab === 'testimonials' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Testimonials management coming soon</p>
        </div>
      )}

      {/* Sections Management */}
      {activeTab === 'sections' && homepageContent?.sections && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-lg">Section Visibility & Order</h3>
          <p className="text-sm text-gray-500">Drag to reorder or toggle visibility</p>
          
          <div className="space-y-3">
            {homepageContent.sections
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((section) => (
                <div key={section.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={section.isVisible}
                    onChange={(e) => {
                      const updated = homepageContent.sections!.map(s =>
                        s.id === section.id ? { ...s, isVisible: e.target.checked } : s
                      );
                      setHomepageContent({ ...homepageContent, sections: updated });
                    }}
                    className="w-5 h-5 text-rose-deep rounded"
                  />
                  <span className="font-medium flex-1">{section.name}</span>
                  <span className="text-sm text-gray-500">Order: {section.displayOrder + 1}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex gap-4 sticky bottom-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown disabled:opacity-50 transition-all"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
};

export default WebsiteContentPage;
