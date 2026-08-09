"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Link as LinkIcon, Compass, Eye, EyeOff } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { NavigationItem } from '@/types/cms';

interface NavigationFormProps {
  item?: NavigationItem | null;
  allNavigation: NavigationItem[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const NavigationForm = ({ item, allNavigation, onClose, onSuccess }: NavigationFormProps) => {
  const { megaMenus, updateNavigation } = useCMS();
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
    label: item?.label || '',
    linkType: item?.linkType || 'internal',
    url: item?.url || '',
    enabled: item?.enabled !== undefined ? item?.enabled : true,
    showOnDesktop: item?.showOnDesktop !== undefined ? item?.showOnDesktop : true,
    showOnMobile: item?.showOnMobile !== undefined ? item?.showOnMobile : true,
    hasDropdown: item?.hasDropdown !== undefined ? item?.hasDropdown : false,
    dropdownSectionIds: item?.dropdownSectionIds || [],
    displayOrder: item !== undefined && item !== null ? item.displayOrder + 1 : (allNavigation.length + 1),
  });

  const handleDropdownSectionToggle = (sectionId: string) => {
    const current = [...formData.dropdownSectionIds];
    if (current.includes(sectionId)) {
      setFormData({
        ...formData,
        dropdownSectionIds: current.filter(id => id !== sectionId),
      });
    } else {
      setFormData({
        ...formData,
        dropdownSectionIds: [...current, sectionId],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.url) return;
    setLoading(true);

    try {
      const isEdit = !!item;
      let updatedList = [...allNavigation];

      if (isEdit) {
        // Remove the item being edited to avoid duplicate IDs during index insertion
        updatedList = updatedList.filter(nav => nav.id !== item?.id);
      }

      // Prepare target item
      const currentItem: NavigationItem = {
        id: item?.id || 'nav_' + Date.now(),
        label: formData.label,
        linkType: formData.linkType as any,
        url: formData.url,
        enabled: formData.enabled,
        showOnDesktop: formData.showOnDesktop,
        showOnMobile: formData.showOnMobile,
        hasDropdown: formData.hasDropdown,
        dropdownSectionIds: formData.hasDropdown ? formData.dropdownSectionIds : [],
        displayOrder: 0, // Will be re-assigned sequentially
      };

      // Insert item at displayOrder - 1
      const targetIdx = Math.max(0, Math.min(formData.displayOrder - 1, updatedList.length));
      updatedList.splice(targetIdx, 0, currentItem);

      // Re-assign displayOrder sequentially 0-indexed for DB compatibility
      const reorderedList = updatedList.map((nav, idx) => ({
        ...nav,
        displayOrder: idx,
      }));

      await updateNavigation(reorderedList);

      onSuccess(isEdit ? 'Navigation link updated successfully' : 'Navigation link created successfully');
      onClose();
    } catch (error) {
      console.error("Error saving navigation link:", error);
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
            <h2 className="text-2xl font-bold font-playfair">{item ? 'Edit Navigation Link' : 'New Navigation Link'}</h2>
            <p className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Manage shop menus & dropdowns</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-rose rounded-full transition-colors focus:outline-none">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Link Label</label>
              <input
                required
                type="text"
                placeholder="e.g. Bestsellers, Wedding Cakes"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Link Type</label>
                <select
                  value={formData.linkType}
                  onChange={(e) => setFormData({ ...formData, linkType: e.target.value as any })}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold bg-white"
                >
                  <option value="internal">Internal Page</option>
                  <option value="collection">Collection</option>
                  <option value="category">Category</option>
                  <option value="custom">Custom URL</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Display Order</label>
                <input
                  type="number"
                  min="1"
                  max={allNavigation.length + (item ? 0 : 1)}
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                  placeholder="e.g. 1, 2, 3..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">URL Slug / Path</label>
              <input
                required
                type="text"
                placeholder="e.g. /menu?category=wedding-cakes"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-semibold text-gray-700"
              />
            </div>

            {/* Visibility checks */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.showOnDesktop}
                  onChange={(e) => setFormData({ ...formData, showOnDesktop: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-rose-deep focus:ring-rose-deep"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-chocolate">Show on Desktop</span>
                  <span className="text-[8px] text-gray-400 uppercase tracking-widest">Header menu</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.showOnMobile}
                  onChange={(e) => setFormData({ ...formData, showOnMobile: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-rose-deep focus:ring-rose-deep"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-chocolate">Show on Mobile</span>
                  <span className="text-[8px] text-gray-400 uppercase tracking-widest">Sidebar menu</span>
                </div>
              </label>
            </div>

            {/* Has Dropdown Toggle */}
            <label className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.hasDropdown}
                onChange={(e) => setFormData({ ...formData, hasDropdown: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-rose-deep focus:ring-rose-deep"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-chocolate">Has Dropdown mega menu</span>
                <span className="text-[8px] text-gray-400 uppercase tracking-widest">Nested menu columns</span>
              </div>
            </label>

            {/* Dropdown Section list (rendered only if hasDropdown is true) */}
            {formData.hasDropdown && (
              <div className="space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-100 animate-in fade-in duration-200">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Select Mega Menu Columns</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {megaMenus.map(section => {
                    const isChecked = formData.dropdownSectionIds.includes(section.id);
                    return (
                      <button
                        type="button"
                        key={section.id}
                        onClick={() => handleDropdownSectionToggle(section.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isChecked
                            ? 'bg-rose-deep text-white border-rose-deep font-bold'
                            : 'bg-white text-chocolate border-gray-100 hover:border-rose/20 text-xs font-semibold'
                        }`}
                      >
                        <p className="text-xs truncate">{section.title}</p>
                        <p className={`text-[8px] uppercase tracking-widest ${isChecked ? 'text-white/70' : 'text-gray-400'}`}>
                          {section.items.length} Items
                        </p>
                      </button>
                    );
                  })}
                  {megaMenus.length === 0 && (
                    <p className="col-span-2 text-center py-4 text-xs italic text-gray-400">
                      No mega menu sections found. Create columns in Website Content panel first.
                    </p>
                  )}
                </div>
              </div>
            )}

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
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Visible to customers</span>
              </div>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
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
              {item ? 'Update Link' : 'Create Link'}
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

export default NavigationForm;
