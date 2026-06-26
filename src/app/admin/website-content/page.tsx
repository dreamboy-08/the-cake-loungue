"use client";

import React, { useState, useEffect } from 'react';
import {
  getSiteSettings,
  updateSiteSettings,
  getContactInfo,
  updateContactInfo,
  getHomepageContent,
  updateHomepageContent,
  getBusinessHours,
  updateBusinessHours,
  SiteSettings,
  ContactInfo,
  HomepageContent,
  BusinessHours
} from '@/utils/adminService';
import {
  Save,
  Loader2,
  Settings,
  Layout,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Plus,
  Trash2,
  Image as ImageIcon,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminContent = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'global' | 'homepage' | 'sections'>('global');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [siteSettings, setSiteSettings] = useState<Partial<SiteSettings>>({});
  const [contactInfo, setContactInfo] = useState<Partial<ContactInfo>>({});
  const [homepageContent, setHomepageContent] = useState<Partial<HomepageContent>>({});
  const [businessHours, setBusinessHours] = useState<Partial<BusinessHours>>({});

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [settings, contact, home, hours] = await Promise.all([
          getSiteSettings(),
          getContactInfo(),
          getHomepageContent(),
          getBusinessHours()
        ]);

        setSiteSettings(settings || {
          logoText: 'Cake Lounge',
          copyrightText: '© 2025 Cake Lounge Patisserie. All rights reserved.',
          announcementBar: {
            enabled: true,
            text: 'Free Delivery Above ₹499',
            link: '/menu'
          }
        });

        setContactInfo(contact || {
          phone: '',
          email: '',
          address: '',
          whatsapp: '',
          googleMaps: '',
          socialLinks: {
            instagram: '',
            facebook: '',
            pinterest: ''
          }
        });

        setHomepageContent(home || {
          hero: {
            title: 'Exquisite Cakes Delivered Fresh',
            subtitle: 'Handcrafted with love using only the finest ingredients.',
            ctaPrimary: { text: 'Order Now', link: '/menu' },
            ctaSecondary: { text: 'View Menu', link: '/menu' },
            images: []
          },
          about: {
            title: 'Baked with Passion, Served with Love',
            description: 'Cake Lounge was born from a grandmother\'s kitchen in 2015. What started as late-night baking sessions and recipes passed down through generations has blossomed into a beloved patisserie trusted by thousands.'
          },
          gallery: [],
          testimonials: [
            { id: 1, name: 'Priya Sharma', role: 'Birthday Celebration', text: 'The cake was absolutely beautiful and tasted even better!', rating: 5 },
            { id: 2, name: 'Rahul Verma', role: 'Anniversary', text: 'Best red velvet cake in town. Highly recommended!', rating: 5 }
          ],
          sections: [
            { id: 'hero', title: 'Hero Banner', enabled: true, order: 0 },
            { id: 'offers', title: 'Offers Bar', enabled: true, order: 1 },
            { id: 'categories', title: 'Featured Categories', enabled: true, order: 2 },
            { id: 'featured', title: 'Featured Products', enabled: true, order: 3 },
            { id: 'about', title: 'Our Story', enabled: true, order: 4 },
            { id: 'testimonials', title: 'Testimonials', enabled: true, order: 5 },
            { id: 'contact', title: 'Contact Section', enabled: true, order: 6 }
          ]
        });

        setBusinessHours(hours || {
          mon_fri: '10:00 AM - 10:00 PM',
          sat_sun: '09:00 AM - 11:00 PM',
          delivery: '11:00 AM - 09:00 PM'
        });

      } catch (error) {
        console.error("Error fetching content:", error);
        showToast("Failed to load content", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveGlobal = async () => {
    setSaving(true);
    try {
      await Promise.all([
        updateSiteSettings(siteSettings),
        updateContactInfo(contactInfo),
        updateBusinessHours(businessHours)
      ]);
      showToast("Global settings saved successfully");
    } catch (error) {
      showToast("Failed to save global settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHomepage = async () => {
    setSaving(true);
    try {
      await updateHomepageContent(homepageContent);
      showToast("Homepage content saved successfully");
    } catch (error) {
      showToast("Failed to save homepage content", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-rose-deep" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[500] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">Website Content</h1>
          <p className="text-gray-500 mt-1">Manage what your customers see on the website.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 self-start">
          <button
            onClick={() => setActiveTab('global')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'global' ? 'bg-chocolate text-white shadow-lg' : 'text-gray-400 hover:text-chocolate'}`}
          >
            Global
          </button>
          <button
            onClick={() => setActiveTab('homepage')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'homepage' ? 'bg-chocolate text-white shadow-lg' : 'text-gray-400 hover:text-chocolate'}`}
          >
            Homepage
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'sections' ? 'bg-chocolate text-white shadow-lg' : 'text-gray-400 hover:text-chocolate'}`}
          >
            Sections
          </button>
        </div>
      </div>

      {activeTab === 'global' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                <Phone size={20} />
              </div>
              <h2 className="text-lg font-bold text-chocolate">Contact Information</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                <input
                  type="text"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">WhatsApp Number</label>
                <input
                  type="text"
                  value={contactInfo.whatsapp}
                  onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Store Address</label>
                <textarea
                  rows={2}
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Primary CTA Text</label>
                  <input
                    type="text"
                    value={homepageContent.hero?.ctaPrimary?.text || ''}
                    onChange={(e) => setHomepageContent({
                      ...homepageContent,
                      hero: {
                        ...(homepageContent.hero || {}),
                        ctaPrimary: {
                          text: e.target.value,
                          link: homepageContent.hero?.ctaPrimary?.link || ''
                        }
                      }
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Primary CTA Link</label>
                  <input
                    type="text"
                    value={homepageContent.hero?.ctaPrimary?.link || ''}
                    onChange={(e) => setHomepageContent({
                      ...homepageContent,
                      hero: {
                        ...(homepageContent.hero || {}),
                        ctaPrimary: {
                          text: homepageContent.hero?.ctaPrimary?.text || '',
                          link: e.target.value
                        }
                      }
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <Type size={20} />
              </div>
              <h2 className="text-lg font-bold text-chocolate">About Section</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title</label>
                <input
                  type="text"
                  value={homepageContent.about?.title}
                  onChange={(e) => setHomepageContent({...homepageContent, about: {...homepageContent.about, title: e.target.value}})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <textarea
                  rows={4}
                  value={homepageContent.about?.description}
                  onChange={(e) => setHomepageContent({...homepageContent, about: {...homepageContent.about, description: e.target.value}})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                  <ImageIcon size={20} />
                </div>
                <h2 className="text-lg font-bold text-chocolate">Gallery Items</h2>
              </div>
              <button
                onClick={() => setHomepageContent({
                  ...homepageContent,
                  gallery: [...(homepageContent.gallery || []), { src: '', label: '' }]
                })}
                className="flex items-center gap-2 text-rose-deep text-xs font-bold uppercase tracking-widest hover:bg-rose/5 px-3 py-2 rounded-lg transition-all"
              >
                <Plus size={14} /> Add Image
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {homepageContent.gallery?.map((img: {src: string, label: string}, index: number) => (
                <div key={index} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 relative group">
                  <button
                    onClick={() => {
                      const newG = [...(homepageContent.gallery || [])];
                      newG.splice(index, 1);
                      setHomepageContent({...homepageContent, gallery: newG});
                    }}
                    className="absolute top-2 right-2 p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image URL</label>
                      <input
                        type="text"
                        value={img.src}
                        onChange={(e) => {
                          const newG = [...(homepageContent.gallery || [])];
                          newG[index].src = e.target.value;
                          setHomepageContent({...homepageContent, gallery: newG});
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-white border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Label</label>
                      <input
                        type="text"
                        value={img.label}
                        onChange={(e) => {
                          const newG = [...(homepageContent.gallery || [])];
                          newG[index].label = e.target.value;
                          setHomepageContent({...homepageContent, gallery: newG});
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-white border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                        placeholder="Image Label"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                  <Share2 size={20} />
                </div>
                <h2 className="text-lg font-bold text-chocolate">Testimonials</h2>
              </div>
              <button
                onClick={() => setHomepageContent({
                  ...homepageContent,
                  testimonials: [...(homepageContent.testimonials || []), { id: Date.now(), name: '', role: '', text: '', rating: 5 }]
                })}
                className="flex items-center gap-2 text-rose-deep text-xs font-bold uppercase tracking-widest hover:bg-rose/5 px-3 py-2 rounded-lg transition-all"
              >
                <Plus size={14} /> Add Testimonial
              </button>
            </div>

            <div className="space-y-6">
              {homepageContent.testimonials?.map((t: {id: number, name: string, role: string, text: string}, index: number) => (
                <div key={t.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 relative group">
                  <button
                    onClick={() => {
                      const newT = [...(homepageContent.testimonials || [])];
                      newT.splice(index, 1);
                      setHomepageContent({...homepageContent, testimonials: newT});
                    }}
                    className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Name</label>
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => {
                          const newT = [...(homepageContent.testimonials || [])];
                          newT[index].name = e.target.value;
                          setHomepageContent({...homepageContent, testimonials: newT});
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-white border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role / Context</label>
                      <input
                        type="text"
                        value={t.role}
                        onChange={(e) => {
                          const newT = [...(homepageContent.testimonials || [])];
                          newT[index].role = e.target.value;
                          setHomepageContent({...homepageContent, testimonials: newT});
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-white border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Testimonial Text</label>
                      <textarea
                        rows={2}
                        value={t.text}
                        onChange={(e) => {
                          const newT = [...(homepageContent.testimonials || [])];
                          newT[index].text = e.target.value;
                          setHomepageContent({...homepageContent, testimonials: newT});
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-white border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media & Business Hours */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                  <Share2 size={20} />
                </div>
                <h2 className="text-lg font-bold text-chocolate">Social Links</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Instagram</label>
                  <input
                    type="text"
                    value={contactInfo.socialLinks?.instagram}
                    onChange={(e) => setContactInfo({...contactInfo, socialLinks: {...contactInfo.socialLinks, instagram: e.target.value}})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Facebook</label>
                  <input
                    type="text"
                    value={contactInfo.socialLinks?.facebook}
                    onChange={(e) => setContactInfo({...contactInfo, socialLinks: {...contactInfo.socialLinks, facebook: e.target.value}})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <Settings size={20} />
                </div>
                <h2 className="text-lg font-bold text-chocolate">Site Footer</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Copyright Text</label>
                  <input
                    type="text"
                    value={siteSettings.copyrightText}
                    onChange={(e) => setSiteSettings({...siteSettings, copyrightText: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                  <Clock size={20} />
                </div>
                <h2 className="text-lg font-bold text-chocolate">Business Hours</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mon - Fri</label>
                  <input
                    type="text"
                    value={businessHours.mon_fri}
                    onChange={(e) => setBusinessHours({...businessHours, mon_fri: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sat - Sun</label>
                  <input
                    type="text"
                    value={businessHours.sat_sun}
                    onChange={(e) => setBusinessHours({...businessHours, sat_sun: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-end">
            <button
              disabled={saving}
              onClick={handleSaveGlobal}
              className="flex items-center gap-2 bg-rose-deep text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span>Save Global Settings</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'homepage' && (
        <div className="space-y-8">
           {/* Announcement Bar */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                  <Layout size={20} />
                </div>
                <h2 className="text-lg font-bold text-chocolate">Announcement Bar</h2>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={siteSettings.announcementBar?.enabled}
                  onChange={(e) => setSiteSettings({...siteSettings, announcementBar: {...siteSettings.announcementBar, enabled: e.target.checked}})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Banner Text</label>
                <input
                  type="text"
                  value={siteSettings.announcementBar?.text}
                  onChange={(e) => setSiteSettings({...siteSettings, announcementBar: {...siteSettings.announcementBar, text: e.target.value}})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                  placeholder="e.g. Free Delivery Above ₹499"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start Date</label>
                <input
                  type="date"
                  value={siteSettings.announcementBar?.startDate || ''}
                  onChange={(e) => setSiteSettings({...siteSettings, announcementBar: {...siteSettings.announcementBar, startDate: e.target.value}})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">End Date</label>
                <input
                  type="date"
                  value={siteSettings.announcementBar?.endDate || ''}
                  onChange={(e) => setSiteSettings({...siteSettings, announcementBar: {...siteSettings.announcementBar, endDate: e.target.value}})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Link (Optional)</label>
                <input
                  type="text"
                  value={siteSettings.announcementBar?.link}
                  onChange={(e) => setSiteSettings({...siteSettings, announcementBar: {...siteSettings.announcementBar, link: e.target.value}})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                  placeholder="/menu"
                />
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-rose-50 text-rose-deep rounded-lg">
                <Layout size={20} />
              </div>
              <h2 className="text-lg font-bold text-chocolate">Hero Section</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Main Title</label>
                <input
                  type="text"
                  value={homepageContent.hero?.title}
                  onChange={(e) => setHomepageContent({...homepageContent, hero: {...homepageContent.hero, title: e.target.value}})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={homepageContent.hero?.subtitle}
                  onChange={(e) => setHomepageContent({...homepageContent, hero: {...homepageContent.hero, subtitle: e.target.value}})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              disabled={saving}
              onClick={handleSaveHomepage}
              className="flex items-center gap-2 bg-rose-deep text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span>Save Homepage Content</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'sections' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-50 text-teal-500 rounded-lg">
              <Layout size={20} />
            </div>
            <h2 className="text-lg font-bold text-chocolate">Homepage Section Builder</h2>
          </div>

          <div className="space-y-3">
            {[...(homepageContent.sections || [])].sort((a, b) => a.order - b.order).map((section, index, array) => (
              <div key={section.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group transition-all hover:bg-white hover:shadow-md">
                <div className="flex flex-col gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => {
                      const newSections = [...(homepageContent.sections || [])];
                      const current = newSections[index];
                      const prev = newSections[index - 1];
                      current.order -= 1;
                      prev.order += 1;
                      setHomepageContent({...homepageContent, sections: newSections});
                    }}
                    className="p-1 text-gray-300 hover:text-chocolate disabled:opacity-0 transition-colors"
                  >
                    <MoveUp size={16} />
                  </button>
                  <button
                    disabled={index === array.length - 1}
                    onClick={() => {
                      const newSections = [...(homepageContent.sections || [])];
                      const current = newSections[index];
                      const next = newSections[index + 1];
                      current.order += 1;
                      next.order -= 1;
                      setHomepageContent({...homepageContent, sections: newSections});
                    }}
                    className="p-1 text-gray-300 hover:text-chocolate disabled:opacity-0 transition-colors"
                  >
                    <MoveDown size={16} />
                  </button>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-chocolate text-sm">{section.title}</h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{section.id}</p>
                </div>

                <button
                  onClick={() => {
                    const newSections = [...(homepageContent.sections || [])];
                    newSections[index].enabled = !newSections[index].enabled;
                    setHomepageContent({...homepageContent, sections: newSections});
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${section.enabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                >
                  {section.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  {section.enabled ? 'Visible' : 'Hidden'}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={saving}
              onClick={handleSaveHomepage}
              className="flex items-center gap-2 bg-rose-deep text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span>Save Section Configuration</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
