"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useCMS } from '@/context/CMSContext';
import { uploadToCloudinary } from '@/utils/cloudinary';
import {
  NavigationItem,
  MegaMenuSection,
  MegaMenuItem,
  HomepageSection,
  Announcement,
  CollectionCMSItem,
  CMSWebsiteSettings,
  CMSMediaItem,
  CMSSEOMetadata,
  CMSGeneralSettings
} from '@/types/cms';
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
  Type,
  Link as LinkIcon,
  Folder,
  Globe,
  Upload,
  Calendar,
  AlertTriangle,
  Menu,
  FileText,
  Search,
  Grid,
  Copy,
  Check,
  Youtube,
  RotateCcw,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminConfirmationModal from '@/components/admin/AdminConfirmationModal';

const AdminCMS = () => {
  const {
    navigation,
    megaMenus,
    homepageSections,
    announcements,
    collections,
    websiteSettings,
    mediaItems,
    seoMetadata,
    generalSettings,
    loading,

    updateNavigation,
    updateMegaMenus,
    updateHomepageSections,
    updateAnnouncements,
    updateCollections,
    updateWebsiteSettings,
    updateMediaItems,
    updateSEOMetadata,
    updateGeneralSettings,

    hasUndo,
    undo,
    restoreDefaults
  } = useCMS();

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'navigation' | 'megamenu' | 'homepage' | 'announcements' | 'collections' | 'settings' | 'media' | 'seo' | 'general'
  >('navigation');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['navigation', 'megamenu', 'homepage', 'announcements', 'collections', 'settings', 'media', 'seo', 'general'].includes(tab)) {
        setActiveTab(tab as any);
      }
    }
  }, []);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Safety / Recovery states and helpers
  const [undoing, setUndoing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  const getCmsKeyForTab = (tab: string) => {
    switch (tab) {
      case 'navigation': return 'navigation';
      case 'megamenu': return 'megaMenus';
      case 'homepage': return 'homepageSections';
      case 'announcements': return 'announcements';
      case 'collections': return 'collections';
      case 'settings': return 'websiteSettings';
      case 'media': return 'mediaItems';
      case 'seo': return 'seoMetadata';
      case 'general': return 'generalSettings';
      default: return '';
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'navigation': return 'Header Navigation';
      case 'megamenu': return 'Mega Menu';
      case 'homepage': return 'Homepage Hero & Layout';
      case 'announcements': return 'Announcements & Marquee';
      case 'collections': return 'Collections';
      case 'settings': return 'Website Settings & Branding';
      case 'media': return 'Media Library References';
      case 'seo': return 'SEO Metadata';
      case 'general': return 'General & Checkout Config';
      default: return tab;
    }
  };

  const handleUndo = async () => {
    const key = getCmsKeyForTab(activeTab);
    if (!key) return;
    setUndoing(true);
    try {
      await undo(key);
      showToast("Previous state restored successfully.");
    } catch (err) {
      console.error(err);
      showToast("Failed to restore previous state.", 'error');
    } finally {
      setUndoing(false);
    }
  };

  const handleRestoreDefaults = async () => {
    const key = getCmsKeyForTab(activeTab);
    if (!key) return;
    setRestoring(true);
    try {
      await restoreDefaults(key);
      setShowRestoreConfirm(false);
      showToast("Default content restored successfully.");
    } catch (err) {
      console.error(err);
      showToast("Failed to restore default content.", 'error');
    } finally {
      setRestoring(false);
    }
  };

  // Drag and drop states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedGroup, setDraggedGroup] = useState<string | null>(null);

  // Search and Filter states
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaFolderFilter, setMediaFolderFilter] = useState('All');
  const [seoSearch, setSeoSearch] = useState('');

  // Editing structures
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    showToast("URL copied to clipboard!");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // --- HTML5 Drag & Drop Reordering handlers ---
  const handleDragStart = (index: number, groupName: string) => {
    setDraggedIndex(index);
    setDraggedGroup(groupName);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetIndex: number, groupName: string) => {
    if (draggedIndex === null || draggedGroup !== groupName) return;

    if (groupName === 'navigation') {
      const reordered = [...navigation];
      const [draggedItem] = reordered.splice(draggedIndex, 1);
      reordered.splice(targetIndex, 0, draggedItem);
      const updated = reordered.map((item, idx) => ({ ...item, displayOrder: idx }));
      setSaving(true);
      await updateNavigation(updated);
      setSaving(false);
      showToast("Navigation order updated");
    }

    if (groupName === 'megamenu') {
      const reordered = [...megaMenus];
      const [draggedItem] = reordered.splice(draggedIndex, 1);
      reordered.splice(targetIndex, 0, draggedItem);
      const updated = reordered.map((item, idx) => ({ ...item, displayOrder: idx }));
      setSaving(true);
      await updateMegaMenus(updated);
      setSaving(false);
      showToast("Mega Menu section order updated");
    }

    if (groupName === 'homepage') {
      const reordered = [...homepageSections];
      const [draggedItem] = reordered.splice(draggedIndex, 1);
      reordered.splice(targetIndex, 0, draggedItem);
      const updated = reordered.map((item, idx) => ({ ...item, order: idx }));
      setSaving(true);
      await updateHomepageSections(updated);
      setSaving(false);
      showToast("Homepage sections order updated");
    }

    if (groupName === 'announcements') {
      const reordered = [...announcements];
      const [draggedItem] = reordered.splice(draggedIndex, 1);
      reordered.splice(targetIndex, 0, draggedItem);
      const updated = reordered.map((item, idx) => ({ ...item, displayOrder: idx }));
      setSaving(true);
      await updateAnnouncements(updated);
      setSaving(false);
      showToast("Announcement order updated");
    }

    if (groupName === 'collections') {
      const reordered = [...collections];
      const [draggedItem] = reordered.splice(draggedIndex, 1);
      reordered.splice(targetIndex, 0, draggedItem);
      const updated = reordered.map((item, idx) => ({ ...item, displayOrder: idx }));
      setSaving(true);
      await updateCollections(updated);
      setSaving(false);
      showToast("Collections order updated");
    }

    setDraggedIndex(null);
    setDraggedGroup(null);
  };

  // --- FORM CRUD SAVE ACTIONS ---
  const handleSaveAll = async (tabName: string) => {
    setSaving(true);
    try {
      showToast(`${tabName} changes saved successfully!`);
    } catch (e) {
      showToast(`Failed to save ${tabName} changes`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoUploading(true);
      try {
        const url = await uploadToCloudinary(file);
        updateWebsiteSettings({ ...websiteSettings, logoUrl: url });
        showToast("Logo uploaded successfully!");
      } catch (err) {
        console.warn("Cloudinary upload failed, using local base64/blob url instead:", err);
        const reader = new FileReader();
        reader.onload = () => {
          updateWebsiteSettings({ ...websiteSettings, logoUrl: reader.result as string });
          showToast("Logo updated (locally)!");
        };
        reader.readAsDataURL(file);
      } finally {
        setLogoUploading(false);
      }
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFaviconUploading(true);
      try {
        const url = await uploadToCloudinary(file);
        updateWebsiteSettings({ ...websiteSettings, faviconUrl: url });
        showToast("Favicon uploaded successfully!");
      } catch (err) {
        console.warn("Cloudinary upload failed, using local base64/blob url instead:", err);
        const reader = new FileReader();
        reader.onload = () => {
          updateWebsiteSettings({ ...websiteSettings, faviconUrl: reader.result as string });
          showToast("Favicon updated (locally)!");
        };
        reader.readAsDataURL(file);
      } finally {
        setFaviconUploading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-rose-deep" size={36} />
        <p className="text-gray-500 font-medium">Synchronizing Enterprise CMS Real-Time...</p>
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

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">The Cake Lounge CMS</h1>
          <p className="text-gray-500 mt-1">Enterprise Content Management Suite. Direct real-time control over 95%+ of frontend assets.</p>
        </div>

        {/* CMS Quick Mode Tabs */}
        <div className="flex flex-wrap bg-white p-1 rounded-2xl shadow-sm border border-gray-100 gap-1">
          {[
            { id: 'navigation', label: 'Navigation', icon: <Menu size={16} /> },
            { id: 'megamenu', label: 'Mega Menu', icon: <Grid size={16} /> },
            { id: 'homepage', label: 'Homepage', icon: <Layout size={16} /> },
            { id: 'announcements', label: 'Announcements', icon: <Clock size={16} /> },
            { id: 'collections', label: 'Collections', icon: <Folder size={16} /> },
            { id: 'settings', label: 'Website Settings', icon: <Settings size={16} /> },
            { id: 'media', label: 'Media Library', icon: <ImageIcon size={16} /> },
            { id: 'seo', label: 'SEO Manager', icon: <Globe size={16} /> },
            { id: 'general', label: 'General', icon: <FileText size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[14px] text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-chocolate text-white shadow-md'
                  : 'text-gray-400 hover:text-chocolate hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              <span className="inline-block">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CMS Safety & Recovery Actions Bar */}
      <div className="bg-cream p-4 rounded-[22px] border border-rose/10 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-rose-deep shrink-0" size={18} />
          <span className="text-xs font-bold text-chocolate uppercase tracking-wider">
            CMS Safety Active — <span className="underline">{getTabLabel(activeTab)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          {hasUndo(getCmsKeyForTab(activeTab)) && (
            <button
              onClick={handleUndo}
              disabled={undoing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-rose-deep/20 bg-rose-deep/5 hover:bg-rose-deep/10 text-rose-deep disabled:opacity-50 h-10 shrink-0 animate-fade-in"
            >
              <RefreshCw size={14} className={undoing ? "animate-spin" : ""} />
              <span>Undo Last Change</span>
            </button>
          )}

          <button
            onClick={() => setShowRestoreConfirm(true)}
            disabled={restoring}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 h-10 shrink-0"
          >
            <RotateCcw size={14} />
            <span>Restore Defaults</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: NAVIGATION MANAGER --- */}
      {activeTab === 'navigation' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-chocolate flex items-center gap-2">
                <Menu size={22} className="text-rose-deep" /> Header Navigation Links
              </h2>
              <p className="text-xs text-gray-400 mt-1">Add, update, or drag navigation elements. Supports dropdown links and icons.</p>
            </div>
            <button
              onClick={() => {
                const newItem: NavigationItem = {
                  id: 'nav_' + Date.now(),
                  label: 'New Link',
                  linkType: 'custom',
                  url: '/custom',
                  enabled: true,
                  displayOrder: navigation.length,
                  showOnDesktop: true,
                  showOnMobile: true,
                  hasDropdown: false
                };
                updateNavigation([...navigation, newItem]);
                showToast("Added new navigation link!");
              }}
              className="flex items-center gap-2 bg-rose-deep text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brown transition-all shadow-sm"
            >
              <Plus size={16} /> Add Navigation Link
            </button>
          </div>

          <div className="space-y-4">
            {navigation.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index, 'navigation')}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index, 'navigation')}
                className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-white hover:shadow-md transition-all cursor-move group"
              >
                {/* Drag handle */}
                <div className="hidden lg:flex flex-col gap-1 text-gray-300 group-hover:text-rose-deep transition-colors">
                  <MoveUp size={14} />
                  <MoveDown size={14} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 w-full">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Label</label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const updated = [...navigation];
                        updated[index].label = e.target.value;
                        updateNavigation(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</label>
                    <select
                      value={item.linkType}
                      onChange={(e) => {
                        const updated = [...navigation];
                        updated[index].linkType = e.target.value as any;
                        updateNavigation(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-semibold"
                    >
                      <option value="internal">Internal Page</option>
                      <option value="collection">Collection</option>
                      <option value="category">Category</option>
                      <option value="custom">Custom URL</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">URL Slug / Path</label>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => {
                        const updated = [...navigation];
                        updated[index].url = e.target.value;
                        updateNavigation(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-semibold text-gray-600"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-4 md:pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.hasDropdown}
                        onChange={(e) => {
                          const updated = [...navigation];
                          updated[index].hasDropdown = e.target.checked;
                          updateNavigation(updated);
                        }}
                        className="rounded text-rose-deep focus:ring-rose-deep h-4 w-4"
                      />
                      <span className="text-xs font-semibold text-gray-600">Has Dropdown</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.showOnDesktop}
                        onChange={(e) => {
                          const updated = [...navigation];
                          updated[index].showOnDesktop = e.target.checked;
                          updateNavigation(updated);
                        }}
                        className="rounded text-rose-deep focus:ring-rose-deep h-4 w-4"
                      />
                      <span className="text-xs font-semibold text-gray-600">Desktop</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.showOnMobile}
                        onChange={(e) => {
                          const updated = [...navigation];
                          updated[index].showOnMobile = e.target.checked;
                          updateNavigation(updated);
                        }}
                        className="rounded text-rose-deep focus:ring-rose-deep h-4 w-4"
                      />
                      <span className="text-xs font-semibold text-gray-600">Mobile</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto justify-end pt-2 lg:pt-0">
                  <button
                    onClick={() => {
                      const updated = [...navigation];
                      updated[index].enabled = !updated[index].enabled;
                      updateNavigation(updated);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      item.enabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {item.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
                    {item.enabled ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => {
                      const updated = navigation.filter((_, idx) => idx !== index);
                      updateNavigation(updated);
                      showToast("Removed navigation link!");
                    }}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={saving}
              onClick={() => handleSaveAll('Navigation')}
              className="flex items-center gap-2 bg-chocolate text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-brown transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>Save Navigation Setup</span>
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 2: MEGA MENU SECTIONS --- */}
      {activeTab === 'megamenu' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-chocolate flex items-center gap-2">
                <Grid size={22} className="text-rose-deep" /> Mega Menu Columns & Nested Items
              </h2>
              <p className="text-xs text-gray-400 mt-1">Manage secondary catalog links and categories structured under top-level items.</p>
            </div>
            <button
              onClick={() => {
                const newSection: MegaMenuSection = {
                  id: 'sec_' + Date.now(),
                  title: 'New Section',
                  displayOrder: megaMenus.length,
                  enabled: true,
                  items: []
                };
                updateMegaMenus([...megaMenus, newSection]);
                showToast("Added new mega menu section!");
              }}
              className="flex items-center gap-2 bg-rose-deep text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brown transition-all shadow-sm"
            >
              <Plus size={16} /> Create Mega Menu Section
            </button>
          </div>

          <div className="space-y-8">
            {megaMenus.map((section, sectionIdx) => (
              <div
                key={section.id}
                draggable
                onDragStart={() => handleDragStart(sectionIdx, 'megamenu')}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(sectionIdx, 'megamenu')}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4 cursor-move"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-gray-300">
                      <MoveUp size={14} />
                      <MoveDown size={14} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-rose-deep uppercase tracking-wider">Mega Menu Column Title</span>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => {
                          const updated = [...megaMenus];
                          updated[sectionIdx].title = e.target.value;
                          updateMegaMenus(updated);
                        }}
                        className="bg-transparent border-none text-base font-bold text-chocolate focus:ring-0 p-0 w-48 font-playfair focus:border-b focus:border-rose-deep outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => {
                        const updated = [...megaMenus];
                        updated[sectionIdx].enabled = !updated[sectionIdx].enabled;
                        updateMegaMenus(updated);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        section.enabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {section.enabled ? 'Visible' : 'Hidden'}
                    </button>

                    <button
                      onClick={() => {
                        const newItem: MegaMenuItem = {
                          id: 'sub_' + Date.now(),
                          name: 'New Item',
                          slug: 'new-slug',
                          url: '/menu',
                          displayOrder: section.items.length,
                          enabled: true
                        };
                        const updated = [...megaMenus];
                        updated[sectionIdx].items = [...section.items, newItem];
                        updateMegaMenus(updated);
                        showToast(`Added sub-item to ${section.title}!`);
                      }}
                      className="flex items-center gap-1 bg-white text-chocolate border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition-all"
                    >
                      <Plus size={14} /> Add Item
                    </button>

                    <button
                      onClick={() => {
                        const updated = megaMenus.filter((_, idx) => idx !== sectionIdx);
                        updateMegaMenus(updated);
                        showToast(`Deleted Mega Menu Section: ${section.title}`);
                      }}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Sub Menu Items list */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {section.items.map((sub, subIdx) => (
                    <div key={sub.id} className="bg-white p-4 rounded-xl border border-gray-100 space-y-3 relative group">
                      <button
                        onClick={() => {
                          const updated = [...megaMenus];
                          updated[sectionIdx].items = section.items.filter((_, idx) => idx !== subIdx);
                          updateMegaMenus(updated);
                        }}
                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={12} />
                      </button>

                      <div className="space-y-2">
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => {
                            const updated = [...megaMenus];
                            updated[sectionIdx].items[subIdx].name = e.target.value;
                            updateMegaMenus(updated);
                          }}
                          placeholder="Item Name"
                          className="w-full text-xs font-bold text-chocolate border-b border-gray-100 focus:border-rose-deep focus:outline-none pb-1"
                        />
                        <input
                          type="text"
                          value={sub.url}
                          onChange={(e) => {
                            const updated = [...megaMenus];
                            updated[sectionIdx].items[subIdx].url = e.target.value;
                            updateMegaMenus(updated);
                          }}
                          placeholder="Link / Path"
                          className="w-full text-[11px] text-gray-500 border-b border-gray-100 focus:border-rose-deep focus:outline-none pb-1"
                        />
                      </div>
                    </div>
                  ))}
                  {section.items.length === 0 && (
                    <div className="col-span-full py-4 text-center text-xs text-gray-400 font-medium italic bg-white rounded-xl border border-dashed border-gray-200">
                      No nested items. Click &apos;Add Item&apos; above to populate this section.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={saving}
              onClick={() => handleSaveAll('Mega Menu')}
              className="flex items-center gap-2 bg-chocolate text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-brown transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>Save Mega Menu Configurations</span>
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 3: HOMEPAGE CMS MANAGER --- */}
      {activeTab === 'homepage' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-chocolate flex items-center gap-2">
              <Layout size={22} className="text-rose-deep" /> Homepage Manager & Section reordering
            </h2>
            <p className="text-xs text-gray-400 mt-1">Control visual headings, copy texts, button action destinations, slide banners and visibility rules for every homepage block.</p>
          </div>

          <div className="space-y-4">
            {homepageSections.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={() => handleDragStart(index, 'homepage')}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index, 'homepage')}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-white transition-all space-y-4 cursor-move group"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-gray-300 group-hover:text-rose-deep transition-colors">
                      <MoveUp size={14} />
                      <MoveDown size={14} />
                    </div>
                    <div>
                      <h3 className="font-bold text-chocolate font-playfair">{section.title}</h3>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Section ID: {section.id}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const updated = [...homepageSections];
                      updated[index].enabled = !updated[index].enabled;
                      updateHomepageSections(updated);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      section.enabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {section.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
                    {section.enabled ? 'Visible' : 'Hidden'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Heading Title</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        const updated = [...homepageSections];
                        updated[index].title = e.target.value;
                        updateHomepageSections(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-semibold"
                    />
                  </div>

                  {section.description !== undefined && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subheading Description</label>
                      <textarea
                        rows={2}
                        value={section.description}
                        onChange={(e) => {
                          const updated = [...homepageSections];
                          updated[index].description = e.target.value;
                          updateHomepageSections(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-medium resize-none"
                      />
                    </div>
                  )}

                  {section.buttonText !== undefined && (
                    <div className="grid grid-cols-2 gap-3 col-span-full">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Button Label</label>
                        <input
                          type="text"
                          value={section.buttonText}
                          onChange={(e) => {
                            const updated = [...homepageSections];
                            updated[index].buttonText = e.target.value;
                            updateHomepageSections(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Button Destination Link</label>
                        <input
                          type="text"
                          value={section.buttonLink}
                          onChange={(e) => {
                            const updated = [...homepageSections];
                            updated[index].buttonLink = e.target.value;
                            updateHomepageSections(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-medium text-gray-500"
                        />
                      </div>
                    </div>
                  )}

                  {section.images && (
                    <div className="col-span-full space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Slider / Background Gallery Images</label>
                        <button
                          onClick={() => {
                            const updated = [...homepageSections];
                            updated[index].images = [...(section.images || []), 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop'];
                            updateHomepageSections(updated);
                          }}
                          className="text-xs font-bold text-rose-deep hover:underline"
                        >
                          + Add Image URL
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {section.images.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className="relative group/img bg-white p-2 rounded-xl border border-gray-200 space-y-2">
                            <button
                              onClick={() => {
                                const updated = [...homepageSections];
                                const currentImages = [...(section.images || [])];
                                currentImages.splice(imgIdx, 1);
                                updated[index].images = currentImages;
                                updateHomepageSections(updated);
                              }}
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors z-10"
                            >
                              <Trash2 size={12} />
                            </button>
                            <img src={imgUrl} className="w-full h-24 object-cover rounded-lg bg-gray-50" />
                            <input
                              type="text"
                              value={imgUrl}
                              onChange={(e) => {
                                const updated = [...homepageSections];
                                const currentImages = [...(section.images || [])];
                                currentImages[imgIdx] = e.target.value;
                                updated[index].images = currentImages;
                                updateHomepageSections(updated);
                              }}
                              className="w-full text-[10px] border-none p-0 focus:ring-0 text-gray-500 truncate"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={saving}
              onClick={() => handleSaveAll('Homepage Sections')}
              className="flex items-center gap-2 bg-chocolate text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-brown transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>Save Home configurations</span>
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 4: PROMOTIONAL STRIPS / ANNOUNCEMENT BAR --- */}
      {activeTab === 'announcements' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-chocolate flex items-center gap-2">
                <Clock size={22} className="text-rose-deep" /> Promotional Scrolling Announcements
              </h2>
              <p className="text-xs text-gray-400 mt-1">Control active announcement bars, coupon scrolling marquee messages, scheduling rules, icons and customized redirect targets.</p>
            </div>
            <button
              onClick={() => {
                const newAnn: Announcement = {
                  id: 'ann_' + Date.now(),
                  text: 'New Banner Text',
                  icon: '🎁',
                  link: '/menu',
                  enabled: true,
                  displayOrder: announcements.length
                };
                updateAnnouncements([...announcements, newAnn]);
                showToast("Added new promo announcement!");
              }}
              className="flex items-center gap-2 bg-rose-deep text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brown transition-all shadow-sm"
            >
              <Plus size={16} /> Create Announcement
            </button>
          </div>

          <div className="space-y-4">
            {announcements.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index, 'announcements')}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index, 'announcements')}
                className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-white hover:shadow-md transition-all cursor-move group"
              >
                <div className="hidden lg:flex flex-col gap-1 text-gray-300 group-hover:text-rose-deep transition-colors">
                  <MoveUp size={14} />
                  <MoveDown size={14} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 w-full">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Announcement Content</label>
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => {
                        const updated = [...announcements];
                        updated[index].text = e.target.value;
                        updateAnnouncements(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Emoji Icon</label>
                    <input
                      type="text"
                      value={item.icon || ''}
                      onChange={(e) => {
                        const updated = [...announcements];
                        updated[index].icon = e.target.value;
                        updateAnnouncements(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CTA Link</label>
                    <input
                      type="text"
                      value={item.link || ''}
                      onChange={(e) => {
                        const updated = [...announcements];
                        updated[index].link = e.target.value;
                        updateAnnouncements(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-medium text-gray-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Schedule Start</label>
                    <input
                      type="date"
                      value={item.startDate || ''}
                      onChange={(e) => {
                        const updated = [...announcements];
                        updated[index].startDate = e.target.value;
                        updateAnnouncements(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-deep text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Schedule End</label>
                    <input
                      type="date"
                      value={item.endDate || ''}
                      onChange={(e) => {
                        const updated = [...announcements];
                        updated[index].endDate = e.target.value;
                        updateAnnouncements(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-deep text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto justify-end pt-2 lg:pt-0">
                  <button
                    onClick={() => {
                      const updated = [...announcements];
                      updated[index].enabled = !updated[index].enabled;
                      updateAnnouncements(updated);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      item.enabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {item.enabled ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => {
                      const updated = announcements.filter((_, idx) => idx !== index);
                      updateAnnouncements(updated);
                      showToast("Promo removed!");
                    }}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={saving}
              onClick={() => handleSaveAll('Announcements')}
              className="flex items-center gap-2 bg-chocolate text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-brown transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>Save Announcements</span>
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 5: COLLECTION CMS MANAGER --- */}
      {activeTab === 'collections' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-chocolate flex items-center gap-2">
                <Folder size={22} className="text-rose-deep" /> Collection Manager
              </h2>
              <p className="text-xs text-gray-400 mt-1">Configure themed collections (e.g. Festival Cakes, Kids Cakes) with titles, custom banners, thumbnails, slugs and tailored SEO tags.</p>
            </div>
            <button
              onClick={() => {
                const newCol: CollectionCMSItem = {
                  id: 'col_' + Date.now(),
                  title: 'New Milestone Cakes',
                  slug: 'new-milestone-cakes',
                  description: 'A newly introduced curated collection.',
                  enabled: true,
                  displayOrder: collections.length
                };
                updateCollections([...collections, newCol]);
                showToast("Created new collection!");
              }}
              className="flex items-center gap-2 bg-rose-deep text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brown transition-all shadow-sm"
            >
              <Plus size={16} /> Add Custom Collection
            </button>
          </div>

          <div className="space-y-6">
            {collections.map((col, index) => (
              <div
                key={col.id}
                draggable
                onDragStart={() => handleDragStart(index, 'collections')}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index, 'collections')}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-220 hover:bg-white transition-all space-y-4 cursor-move group"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-gray-300 group-hover:text-rose-deep transition-colors">
                      <MoveUp size={14} />
                      <MoveDown size={14} />
                    </div>
                    <div>
                      <h3 className="font-bold text-chocolate text-base">{col.title || 'Untitled Collection'}</h3>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ID: {col.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const updated = [...collections];
                        updated[index].enabled = !updated[index].enabled;
                        updateCollections(updated);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        col.enabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {col.enabled ? 'Active' : 'Draft'}
                    </button>

                    <button
                      onClick={() => {
                        const updated = collections.filter((_, idx) => idx !== index);
                        updateCollections(updated);
                        showToast(`Deleted Collection: ${col.title}`);
                      }}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => {
                        const updated = [...collections];
                        updated[index].title = e.target.value;
                        updateCollections(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-semibold text-chocolate"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Slug</label>
                    <input
                      type="text"
                      value={col.slug}
                      onChange={(e) => {
                        const updated = [...collections];
                        updated[index].slug = e.target.value;
                        updateCollections(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SEO Keywords</label>
                    <input
                      type="text"
                      value={col.seoKeywords || ''}
                      onChange={(e) => {
                        const updated = [...collections];
                        updated[index].seoKeywords = e.target.value;
                        updateCollections(updated);
                      }}
                      placeholder="comma separated"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-medium text-gray-500"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
                    <textarea
                      rows={2}
                      value={col.description || ''}
                      onChange={(e) => {
                        const updated = [...collections];
                        updated[index].description = e.target.value;
                        updateCollections(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-medium text-gray-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Banner Image URL</label>
                    <input
                      type="text"
                      value={col.bannerImage || ''}
                      onChange={(e) => {
                        const updated = [...collections];
                        updated[index].bannerImage = e.target.value;
                        updateCollections(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-xs text-gray-500 truncate"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thumbnail Image URL</label>
                    <input
                      type="text"
                      value={col.thumbnailImage || ''}
                      onChange={(e) => {
                        const updated = [...collections];
                        updated[index].thumbnailImage = e.target.value;
                        updateCollections(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-xs text-gray-500 truncate"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SEO Title</label>
                    <input
                      type="text"
                      value={col.seoTitle || ''}
                      onChange={(e) => {
                        const updated = [...collections];
                        updated[index].seoTitle = e.target.value;
                        updateCollections(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-xs text-gray-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={saving}
              onClick={() => handleSaveAll('Collections')}
              className="flex items-center gap-2 bg-chocolate text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-brown transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>Save Collection Directory</span>
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 6: WEBSITE & THEME SETTINGS --- */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Branding Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-chocolate flex items-center gap-2 border-b border-gray-100 pb-3">
              <Settings size={22} className="text-rose-deep" /> Branding & Styling Settings
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Logo Brand text</label>
                <input
                  type="text"
                  value={websiteSettings.logoText}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, logoText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Website Name</label>
                <input
                  type="text"
                  value={websiteSettings.websiteName}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, websiteName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-semibold"
                />
              </div>

              {/* Logo / Favicon Visual Upload Section */}
              <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                {/* Logo Uploader */}
                <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Logo Brand Image</span>
                  <div
                    className="relative w-full h-16 rounded-xl border border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center cursor-pointer group"
                    onClick={() => document.getElementById('logo-file-input')?.click()}
                  >
                    {websiteSettings.logoUrl ? (
                      <>
                        <img src={websiteSettings.logoUrl} alt="Logo Preview" className="h-10 object-contain" />
                        <div className="absolute inset-0 bg-chocolate/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload size={18} className="text-white animate-pulse" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        {logoUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                        <span className="text-[9px] font-bold uppercase mt-1">Click to Upload</span>
                      </div>
                    )}
                  </div>
                  <input
                    id="logo-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <input
                    type="text"
                    value={websiteSettings.logoUrl || ''}
                    onChange={(e) => updateWebsiteSettings({ ...websiteSettings, logoUrl: e.target.value })}
                    placeholder="Or paste Logo URL directly..."
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-rose-deep font-semibold"
                  />
                </div>

                {/* Favicon Uploader */}
                <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Favicon Site Icon</span>
                  <div
                    className="relative w-12 h-12 rounded-xl border border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center cursor-pointer group"
                    onClick={() => document.getElementById('favicon-file-input')?.click()}
                  >
                    {websiteSettings.faviconUrl ? (
                      <>
                        <img src={websiteSettings.faviconUrl} alt="Favicon Preview" className="w-8 h-8 object-contain" />
                        <div className="absolute inset-0 bg-chocolate/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload size={14} className="text-white animate-pulse" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        {faviconUploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                        <span className="text-[8px] font-bold uppercase mt-1">Upload</span>
                      </div>
                    )}
                  </div>
                  <input
                    id="favicon-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFaviconUpload}
                  />
                  <input
                    type="text"
                    value={websiteSettings.faviconUrl || ''}
                    onChange={(e) => updateWebsiteSettings({ ...websiteSettings, faviconUrl: e.target.value })}
                    placeholder="Or paste Favicon URL..."
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-rose-deep font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Primary Theme Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={websiteSettings.primaryColor}
                    onChange={(e) => updateWebsiteSettings({ ...websiteSettings, primaryColor: e.target.value })}
                    className="h-9 w-9 rounded-lg border border-gray-200 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={websiteSettings.primaryColor}
                    onChange={(e) => updateWebsiteSettings({ ...websiteSettings, primaryColor: e.target.value })}
                    className="flex-1 px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Secondary Theme Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={websiteSettings.secondaryColor}
                    onChange={(e) => updateWebsiteSettings({ ...websiteSettings, secondaryColor: e.target.value })}
                    className="h-9 w-9 rounded-lg border border-gray-200 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={websiteSettings.secondaryColor}
                    onChange={(e) => updateWebsiteSettings({ ...websiteSettings, secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accent Golden Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={websiteSettings.accentColor}
                    onChange={(e) => updateWebsiteSettings({ ...websiteSettings, accentColor: e.target.value })}
                    className="h-9 w-9 rounded-lg border border-gray-200 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={websiteSettings.accentColor}
                    onChange={(e) => updateWebsiteSettings({ ...websiteSettings, accentColor: e.target.value })}
                    className="flex-1 px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Typography Fonts</label>
                <input
                  type="text"
                  value={websiteSettings.typography}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, typography: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Border Radius Cards</label>
                <input
                  type="text"
                  value={websiteSettings.borderRadius}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, borderRadius: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1 col-span-full">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Footer Narrative Brand Text</label>
              <textarea
                rows={2}
                value={websiteSettings.footerText}
                onChange={(e) => updateWebsiteSettings({ ...websiteSettings, footerText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-medium resize-none"
              />
            </div>
          </div>

          {/* Business & Contact Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-chocolate flex items-center gap-2 border-b border-gray-100 pb-3">
              <Phone size={22} className="text-rose-deep" /> Business & Contact Directory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Registered Business Name</label>
                <input
                  type="text"
                  value={websiteSettings.businessName}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, businessName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Email</label>
                <input
                  type="email"
                  value={websiteSettings.email}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Support</label>
                <input
                  type="text"
                  value={websiteSettings.phone}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">WhatsApp Contact</label>
                <input
                  type="text"
                  value={websiteSettings.whatsapp}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="space-y-1 col-span-full">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Google Maps Embed/Location Link</label>
                <input
                  type="text"
                  value={websiteSettings.googleMapsUrl || ''}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, googleMapsUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-xs text-gray-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Business Hours Mon-Fri</label>
                <input
                  type="text"
                  value={websiteSettings.businessHoursMonFri}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, businessHoursMonFri: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Business Hours Sat-Sun</label>
                <input
                  type="text"
                  value={websiteSettings.businessHoursSatSun}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, businessHoursSatSun: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Instagram URL</label>
                <input
                  type="text"
                  value={websiteSettings.instagramUrl || ''}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-xs text-gray-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Facebook URL</label>
                <input
                  type="text"
                  value={websiteSettings.facebookUrl || ''}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, facebookUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-xs text-gray-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pinterest URL</label>
                <input
                  type="text"
                  value={websiteSettings.pinterestUrl || ''}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, pinterestUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-xs text-gray-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">YouTube URL</label>
                <input
                  type="text"
                  value={websiteSettings.youtubeUrl || ''}
                  onChange={(e) => updateWebsiteSettings({ ...websiteSettings, youtubeUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-xs text-gray-500 font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1 col-span-full">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Physical Shop Address</label>
              <textarea
                rows={2}
                value={websiteSettings.address}
                onChange={(e) => updateWebsiteSettings({ ...websiteSettings, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-semibold resize-none"
              />
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-end">
            <button
              disabled={saving}
              onClick={() => handleSaveAll('Settings')}
              className="flex items-center gap-2 bg-rose-deep text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown hover:-translate-y-0.5 transition-all"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span>Save Website Branding</span>
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 7: MEDIA LIBRARY --- */}
      {activeTab === 'media' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-chocolate flex items-center gap-2">
                <ImageIcon size={22} className="text-rose-deep" /> Enterprise Media Assets
              </h2>
              <p className="text-xs text-gray-400 mt-1">Upload, replace, structure in folders, copy instantly, or search images.</p>
            </div>

            <div className="flex gap-2">
              <label className="flex items-center gap-2 bg-rose-deep text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-brown cursor-pointer transition-all shadow-sm">
                <Upload size={16} /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const newMedia: CMSMediaItem = {
                        id: 'med_' + Date.now(),
                        url: reader.result as string, // Fallback base64 or blob URL
                        name: file.name,
                        size: file.size,
                        folder: mediaFolderFilter === 'All' ? 'Uploads' : mediaFolderFilter,
                        altText: file.name.split('.')[0] + ' product showcase texture',
                        createdAt: new Date().toISOString()
                      };
                      updateMediaItems([...mediaItems, newMedia]);
                      showToast("Uploaded image to library!");
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100 w-full md:w-80">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search images by name or alt text..."
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                className="bg-transparent border-none p-0 text-xs text-chocolate focus:ring-0 outline-none w-full font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Folder</span>
              <select
                value={mediaFolderFilter}
                onChange={(e) => setMediaFolderFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-gray-100 text-xs font-semibold focus:outline-none"
              >
                <option value="All">All Folders</option>
                <option value="Bestsellers">Bestsellers</option>
                <option value="Weddings">Weddings</option>
                <option value="Birthdays">Birthdays</option>
                <option value="Uploads">Uploads</option>
              </select>
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
            {mediaItems
              .filter(item => {
                const matchesFolder = mediaFolderFilter === 'All' || item.folder === mediaFolderFilter;
                const matchesSearch = item.name.toLowerCase().includes(mediaSearch.toLowerCase()) ||
                  (item.altText && item.altText.toLowerCase().includes(mediaSearch.toLowerCase()));
                return matchesFolder && matchesSearch;
              })
              .map((item) => (
                <div key={item.id} className="relative group bg-gray-50 p-3 rounded-2xl border border-gray-220 flex flex-col space-y-3">
                  <div className="relative aspect-square w-full rounded-lg bg-white overflow-hidden border border-gray-100">
                    <img src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                    <button
                      onClick={() => {
                        const updated = mediaItems.filter(m => m.id !== item.id);
                        updateMediaItems(updated);
                        showToast("Asset purged from media library.");
                      }}
                      className="absolute top-1.5 right-1.5 bg-white/90 rounded-full p-1.5 shadow hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors z-10"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-chocolate truncate" title={item.name}>{item.name}</p>
                      <span className="text-[9px] text-gray-400 font-semibold uppercase">{item.folder || 'Default'}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(item.url)}
                        className="flex-1 flex items-center justify-center gap-1 bg-white border border-gray-200 py-1.5 rounded-lg text-[10px] font-bold text-chocolate hover:bg-gray-100 transition-all"
                      >
                        {copiedUrl === item.url ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                        <span>{copiedUrl === item.url ? 'Copied' : 'Copy URL'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* --- TAB 8: SEO METADATA MANAGER --- */}
      {activeTab === 'seo' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-chocolate flex items-center gap-2">
                <Globe size={22} className="text-rose-deep" /> SEO & Meta Manager
              </h2>
              <p className="text-xs text-gray-400 mt-1">Configure search visibility tags, canonical URLs, OG Social styling and structured schemas per storefront view.</p>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search slugs..."
                value={seoSearch}
                onChange={(e) => setSeoSearch(e.target.value)}
                className="bg-transparent border-none p-0 text-xs focus:ring-0 outline-none w-40 font-medium"
              />
            </div>
          </div>

          <div className="space-y-6">
            {seoMetadata
              .filter(item => item.id.toLowerCase().includes(seoSearch.toLowerCase()))
              .map((item, index) => (
                <div key={item.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-white transition-all space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-rose-deep uppercase tracking-wider">Page Target Slug</span>
                      <h3 className="font-mono text-sm font-bold text-chocolate">/{item.id === 'home' ? '' : item.id}</h3>
                    </div>

                    <button
                      onClick={() => {
                        const updated = [...seoMetadata];
                        updated[index].indexPage = !updated[index].indexPage;
                        updateSEOMetadata(updated);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        item.indexPage ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {item.indexPage ? 'Index / Search Active' : 'NoIndex / Private'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SEO Title Tag (50-60 characters)</label>
                      <input
                        type="text"
                        value={item.seoTitle}
                        onChange={(e) => {
                          const updated = [...seoMetadata];
                          updated[index].seoTitle = e.target.value;
                          updateSEOMetadata(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SEO Keywords</label>
                      <input
                        type="text"
                        value={item.keywords}
                        onChange={(e) => {
                          const updated = [...seoMetadata];
                          updated[index].keywords = e.target.value;
                          updateSEOMetadata(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-medium"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Meta Description (150-160 characters)</label>
                      <textarea
                        rows={2}
                        value={item.metaDescription}
                        onChange={(e) => {
                          const updated = [...seoMetadata];
                          updated[index].metaDescription = e.target.value;
                          updateSEOMetadata(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-medium resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Canonical Link URL</label>
                      <input
                        type="text"
                        value={item.canonicalUrl || ''}
                        onChange={(e) => {
                          const updated = [...seoMetadata];
                          updated[index].canonicalUrl = e.target.value;
                          updateSEOMetadata(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-xs text-gray-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">OG / Social Preview Image URL</label>
                      <input
                        type="text"
                        value={item.ogImage || ''}
                        onChange={(e) => {
                          const updated = [...seoMetadata];
                          updated[index].ogImage = e.target.value;
                          updateSEOMetadata(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-xs text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={saving}
              onClick={() => handleSaveAll('SEO Metadata')}
              className="flex items-center gap-2 bg-chocolate text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-brown transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>Save Search Meta</span>
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 9: GENERAL SETTINGS --- */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-chocolate flex items-center gap-2 border-b border-gray-100 pb-3">
              <Globe size={22} className="text-rose-deep" /> Checkout & Service Configurations
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Standard Delivery Charge (₹)</label>
                <input
                  type="number"
                  value={generalSettings.deliveryCharges}
                  onChange={(e) => updateGeneralSettings({ ...generalSettings, deliveryCharges: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Free Shipping Threshold (₹)</label>
                <input
                  type="number"
                  value={generalSettings.freeDeliveryThreshold}
                  onChange={(e) => updateGeneralSettings({ ...generalSettings, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Minimum Allowed Cart Order (₹)</label>
                <input
                  type="number"
                  value={generalSettings.minimumOrder}
                  onChange={(e) => updateGeneralSettings({ ...generalSettings, minimumOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Store Maintenance Mode</label>
                <button
                  onClick={() => updateGeneralSettings({ ...generalSettings, maintenanceMode: !generalSettings.maintenanceMode })}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-all h-9 flex items-center justify-center gap-2 ${
                    generalSettings.maintenanceMode
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-green-50 text-green-600 border border-green-200'
                  }`}
                >
                  <AlertTriangle size={14} />
                  {generalSettings.maintenanceMode ? 'Maintenance Mode ACTIVE' : 'Storefront Live'}
                </button>
              </div>
            </div>

            <div className="space-y-2 col-span-full">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Serviceable Delivery Zipcodes (Gurugram)</label>
              <textarea
                rows={3}
                value={generalSettings.serviceableZipCodes.join(', ')}
                onChange={(e) => {
                  const codes = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  updateGeneralSettings({ ...generalSettings, serviceableZipCodes: codes });
                }}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none text-xs font-semibold font-mono"
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-chocolate flex items-center gap-2 border-b border-gray-100 pb-3">
              <AlertTriangle size={22} className="text-rose-deep" /> Emergency, Coupons & Holidays
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-gray-100 space-y-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-chocolate">Emergency Notice Banner</span>
                  <input
                    type="checkbox"
                    checked={generalSettings.emergencyBannerEnabled}
                    onChange={(e) => updateGeneralSettings({ ...generalSettings, emergencyBannerEnabled: e.target.checked })}
                    className="rounded text-rose-deep focus:ring-rose-deep"
                  />
                </div>
                <input
                  type="text"
                  value={generalSettings.emergencyBannerText}
                  onChange={(e) => updateGeneralSettings({ ...generalSettings, emergencyBannerText: e.target.value })}
                  placeholder="Emergency banner text copy..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-100 focus:outline-none text-xs font-medium"
                />
              </div>

              <div className="p-4 rounded-xl border border-gray-100 space-y-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-chocolate">Active Coupon Marquee Strip</span>
                  <input
                    type="checkbox"
                    checked={generalSettings.couponBannerEnabled}
                    onChange={(e) => updateGeneralSettings({ ...generalSettings, couponBannerEnabled: e.target.checked })}
                    className="rounded text-rose-deep focus:ring-rose-deep"
                  />
                </div>
                <input
                  type="text"
                  value={generalSettings.couponBannerText}
                  onChange={(e) => updateGeneralSettings({ ...generalSettings, couponBannerText: e.target.value })}
                  placeholder="Coupon banner copy..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-100 focus:outline-none text-xs font-semibold text-rose-deep"
                />
              </div>

              <div className="p-4 rounded-xl border border-gray-100 space-y-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-chocolate">Smart Popup Banner Message</span>
                  <input
                    type="checkbox"
                    checked={generalSettings.popupMessageEnabled}
                    onChange={(e) => updateGeneralSettings({ ...generalSettings, popupMessageEnabled: e.target.checked })}
                    className="rounded text-rose-deep focus:ring-rose-deep"
                  />
                </div>
                <input
                  type="text"
                  value={generalSettings.popupMessageTitle}
                  onChange={(e) => updateGeneralSettings({ ...generalSettings, popupMessageTitle: e.target.value })}
                  placeholder="Welcome popup title..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-100 focus:outline-none text-xs font-bold text-chocolate"
                />
                <textarea
                  rows={2}
                  value={generalSettings.popupMessageText}
                  onChange={(e) => updateGeneralSettings({ ...generalSettings, popupMessageText: e.target.value })}
                  placeholder="Popup description text copy..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-100 focus:outline-none text-xs font-medium resize-none"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-end">
            <button
              disabled={saving}
              onClick={() => handleSaveAll('General config')}
              className="flex items-center gap-2 bg-rose-deep text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown hover:-translate-y-0.5 transition-all"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span>Save System Settings</span>
            </button>
          </div>
        </div>
      )}

      <AdminConfirmationModal
        isOpen={showRestoreConfirm}
        onClose={() => setShowRestoreConfirm(false)}
        onConfirm={handleRestoreDefaults}
        title="Restore Default Content?"
        message={`This will replace the current content in the ${getTabLabel(activeTab)} section with the original default content. Your current changes can be recovered using Undo.`}
        confirmText="Restore Defaults"
        cancelText="Cancel"
        type="danger"
        isLoading={restoring}
      />
    </div>
  );
};

export default AdminCMS;
