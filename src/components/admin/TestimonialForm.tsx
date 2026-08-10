"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { CMSTestimonial } from '@/types/cms';

interface TestimonialFormProps {
  item?: CMSTestimonial | null;
  allTestimonials: CMSTestimonial[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const TestimonialForm = ({ item, allTestimonials, onClose, onSuccess }: TestimonialFormProps) => {
  const { updateTestimonials } = useCMS();
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

  const [formData, setFormData] = useState({
    name: item?.name || '',
    text: item?.text || '',
    rating: item?.rating || 5,
    tag: item?.tag || '',
    enabled: item?.enabled !== undefined ? item?.enabled : true,
    displayOrder: item !== undefined && item !== null ? item.displayOrder + 1 : (allTestimonials.length + 1),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.text) return;
    setLoading(true);

    try {
      const isEdit = !!item;
      let updatedList = [...allTestimonials];

      if (isEdit) {
        updatedList = updatedList.filter(t => t.id !== item?.id);
      }

      const currentItem: CMSTestimonial = {
        ...item, // Preserve existing properties like id, status, orderId, etc.
        id: item?.id || 'test_' + Date.now(),
        name: formData.name,
        text: formData.text,
        rating: Number(formData.rating),
        tag: formData.tag || undefined,
        avatar: item?.avatar || '', // Do not require avatar
        enabled: formData.enabled,
        displayOrder: 0, // Assigned sequentially
      };

      const targetIdx = Math.max(0, Math.min(formData.displayOrder - 1, updatedList.length));
      updatedList.splice(targetIdx, 0, currentItem);

      // Re-assign displayOrder sequentially 0-indexed for consistency
      const reorderedList = updatedList.map((t, idx) => ({
        ...t,
        displayOrder: idx,
      }));

      await updateTestimonials(reorderedList);

      onSuccess(isEdit ? 'Testimonial updated successfully' : 'Testimonial created successfully');
      onClose();
    } catch (error) {
      console.error("Error saving testimonial:", error);
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
            <h2 className="text-2xl font-bold font-playfair">{item ? 'Edit Testimonial' : 'New Testimonial'}</h2>
            <p className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Manage customer stories and reviews</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-rose rounded-full transition-colors focus:outline-none">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6 overflow-y-auto">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Customer Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Review Text</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Ordered a custom birthday cake..."
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-semibold text-gray-700 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  required
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5 })}
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
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Designation / Tag (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Loyal Customer · 3 yrs"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-semibold text-gray-700"
              />
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
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Visible on storefront testimonials section</span>
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

export default TestimonialForm;
