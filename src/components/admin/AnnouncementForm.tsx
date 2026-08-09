"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Megaphone, Link as LinkIcon, Calendar, Info } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { Announcement } from '@/types/cms';

interface AnnouncementFormProps {
  item?: Announcement | null;
  allAnnouncements: Announcement[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const AnnouncementForm = ({ item, allAnnouncements, onClose, onSuccess }: AnnouncementFormProps) => {
  const { updateAnnouncements } = useCMS();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Format date to local datetime string or empty
  const formatDateToInput = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      // If it's stored as an ISO string, convert to local format for datetime-local input (YYYY-MM-DDTHH:mm)
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const pad = (num: number) => String(num).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    text: item?.text || '',
    icon: item?.icon || '🎂',
    link: item?.link || '',
    enabled: item?.enabled !== undefined ? item?.enabled : true,
    startDate: formatDateToInput(item?.startDate),
    endDate: formatDateToInput(item?.endDate),
    displayOrder: item !== undefined && item !== null ? item.displayOrder + 1 : (allAnnouncements.length + 1),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text) return;
    setLoading(true);

    try {
      const isEdit = !!item;
      let updatedList = [...allAnnouncements];

      if (isEdit) {
        updatedList = updatedList.filter(ann => ann.id !== item?.id);
      }

      // Convert dates back to ISO strings or null/undefined
      const startIso = formData.startDate ? new Date(formData.startDate).toISOString() : undefined;
      const endIso = formData.endDate ? new Date(formData.endDate).toISOString() : undefined;

      const currentItem: Announcement = {
        id: item?.id || 'ann_' + Date.now(),
        text: formData.text,
        icon: formData.icon || undefined,
        link: formData.link || undefined,
        enabled: formData.enabled,
        startDate: startIso,
        endDate: endIso,
        displayOrder: 0, // Assigned sequentially
      };

      const targetIdx = Math.max(0, Math.min(formData.displayOrder - 1, updatedList.length));
      updatedList.splice(targetIdx, 0, currentItem);

      // Re-assign displayOrder sequentially 0-indexed for DB/Context consistency
      const reorderedList = updatedList.map((ann, idx) => ({
        ...ann,
        displayOrder: idx,
      }));

      await updateAnnouncements(reorderedList);

      onSuccess(isEdit ? 'Announcement updated successfully' : 'Announcement created successfully');
      onClose();
    } catch (error) {
      console.error("Error saving announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-chocolate/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b flex items-center justify-between bg-chocolate text-white shrink-0">
          <div>
            <h2 className="text-2xl font-bold font-playfair">{item ? 'Edit Announcement' : 'New Announcement'}</h2>
            <p className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Manage shop scrolling marquee banners</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-rose rounded-full transition-colors focus:outline-none">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6 overflow-y-auto">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Announcement Text</label>
              <textarea
                required
                rows={2}
                placeholder="e.g. 🎂 Flat 20% OFF on Birthday Cakes"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Icon / Emoji</label>
                <input
                  type="text"
                  placeholder="e.g. 🎂, 🚚, 🎉"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Display Order</label>
                <input
                  type="number"
                  min="1"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                  placeholder="e.g. 1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Link URL (Optional)</label>
              <input
                type="text"
                placeholder="e.g. /collections/birthday-cakes or https://..."
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-semibold text-gray-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar size={12} />
                  <span>Start Date & Time</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-xs font-semibold text-gray-700 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar size={12} />
                  <span>End Date & Time</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-xs font-semibold text-gray-700 bg-white"
                />
              </div>
            </div>

            <div className="p-4 bg-cream/30 border border-cream rounded-2xl flex items-start gap-3">
              <Info className="text-rose-deep shrink-0 mt-0.5" size={16} />
              <p className="text-[11px] text-rose-deep/80 leading-relaxed font-medium">
                Leave dates empty to make the announcement always eligible. Expired and future-dated announcements will dynamically hide on the storefront.
              </p>
            </div>

            {/* Active Status Toggle */}
            <label className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-rose-deep focus:ring-rose-deep"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-chocolate">Active Status</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Visible on storefront marquee</span>
              </div>
            </label>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all focus:outline-none"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-[2] py-4 bg-rose-deep text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-deep/20 hover:bg-brown transition-all flex items-center justify-center gap-2 focus:outline-none"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[600]" onClick={onClose}>
      {formContent}
    </div>,
    document.body
  );
};

export default AnnouncementForm;
