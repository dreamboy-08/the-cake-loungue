"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Plus, Trash, ArrowUp, ArrowDown, Eye, EyeOff, Link as LinkIcon } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { MegaMenuSection, MegaMenuItem } from '@/types/cms';

interface MegaMenuFormProps {
  item?: MegaMenuSection | null;
  allSections: MegaMenuSection[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const MegaMenuForm = ({ item, allSections, onClose, onSuccess }: MegaMenuFormProps) => {
  const { updateMegaMenus } = useCMS();
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
    title: item?.title || '',
    enabled: item?.enabled !== undefined ? item?.enabled : true,
    displayOrder: item !== undefined && item !== null ? item.displayOrder + 1 : (allSections.length + 1),
    items: item?.items ? [...item.items].sort((a, b) => a.displayOrder - b.displayOrder) : [] as MegaMenuItem[],
  });

  const handleAddItem = () => {
    const newItem: MegaMenuItem = {
      id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: '',
      slug: '',
      url: '',
      displayOrder: formData.items.length,
      enabled: true,
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
  };

  const handleUpdateItemField = (itemId: string, field: keyof MegaMenuItem, value: any) => {
    const updatedItems = formData.items.map(sub => {
      if (sub.id === itemId) {
        const updated = { ...sub, [field]: value };
        if (field === 'name') {
          updated.slug = (value as string).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        }
        return updated;
      }
      return sub;
    });
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const handleDeleteItem = (itemId: string) => {
    const filtered = formData.items.filter(sub => sub.id !== itemId);
    const reordered = filtered.map((sub, idx) => ({
      ...sub,
      displayOrder: idx
    }));
    setFormData({
      ...formData,
      items: reordered,
    });
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const items = [...formData.items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    // Swap
    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;

    // Re-index
    const reordered = items.map((sub, idx) => ({
      ...sub,
      displayOrder: idx
    }));

    setFormData({
      ...formData,
      items: reordered,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    // Validation: make sure all items have a name and URL filled out if there are items
    for (const sub of formData.items) {
      if (!sub.name.trim() || !sub.url.trim()) {
        alert("Please make sure all nested links have both a name and a URL.");
        return;
      }
    }

    setLoading(true);

    try {
      const isEdit = !!item;
      let updatedList = [...allSections];

      if (isEdit) {
        updatedList = updatedList.filter(sec => sec.id !== item?.id);
      }

      // Prepare target section
      const currentSection: MegaMenuSection = {
        id: item?.id || 'sec_' + Date.now(),
        title: formData.title,
        enabled: formData.enabled,
        displayOrder: 0, // Will be re-assigned sequentially
        items: formData.items,
      };

      // Insert section at displayOrder - 1
      const targetIdx = Math.max(0, Math.min(formData.displayOrder - 1, updatedList.length));
      updatedList.splice(targetIdx, 0, currentSection);

      // Re-assign displayOrder sequentially 0-indexed for DB compatibility
      const reorderedList = updatedList.map((sec, idx) => ({
        ...sec,
        displayOrder: idx,
      }));

      await updateMegaMenus(reorderedList);

      onSuccess(isEdit ? 'Mega Menu column updated successfully' : 'Mega Menu column created successfully');
      onClose();
    } catch (error) {
      console.error("Error saving Mega Menu column:", error);
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-chocolate/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b flex items-center justify-between bg-chocolate text-white shrink-0">
          <div>
            <h2 className="text-2xl font-bold font-playfair">{item ? 'Edit Mega Menu Column' : 'New Mega Menu Column'}</h2>
            <p className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Manage secondary links & categories</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-rose rounded-full transition-colors focus:outline-none">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Column Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Categories, Flavours, Occasions"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Display Order</label>
                <input
                  type="number"
                  min="1"
                  max={allSections.length + (item ? 0 : 1)}
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                  placeholder="e.g. 1, 2, 3..."
                />
              </div>
            </div>

            {/* Nested Links Manager */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Nested Links / Items</label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1.5 bg-rose-deep text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brown transition-all shadow-sm h-9"
                >
                  <Plus size={14} /> Add Link
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                {formData.items.length > 0 ? (
                  formData.items.map((sub, idx) => (
                    <div
                      key={sub.id}
                      className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:shadow-sm transition-all relative group ${
                        sub.enabled === false ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveItem(idx, 'up')}
                          className="p-1 text-gray-400 hover:text-rose-deep hover:bg-cream-dark rounded-lg disabled:opacity-20 transition-all focus:outline-none"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === formData.items.length - 1}
                          onClick={() => handleMoveItem(idx, 'down')}
                          className="p-1 text-gray-400 hover:text-rose-deep hover:bg-cream-dark rounded-lg disabled:opacity-20 transition-all focus:outline-none"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                        <input
                          required
                          type="text"
                          placeholder="Link Label (e.g. Birthday Cakes)"
                          value={sub.name}
                          onChange={(e) => handleUpdateItemField(sub.id, 'name', e.target.value)}
                          className="px-3 py-2 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-xs font-bold text-chocolate"
                        />
                        <input
                          required
                          type="text"
                          placeholder="URL (e.g. /menu?category=birthday-cakes)"
                          value={sub.url}
                          onChange={(e) => handleUpdateItemField(sub.id, 'url', e.target.value)}
                          className="px-3 py-2 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-xs font-semibold text-gray-600"
                        />
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateItemField(sub.id, 'enabled', !sub.enabled)}
                          className={`p-2 rounded-xl transition-all focus:outline-none ${
                            sub.enabled === false
                              ? 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                          }`}
                          title={sub.enabled === false ? 'Disabled (Hidden)' : 'Active (Live)'}
                        >
                          {sub.enabled === false ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(sub.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all focus:outline-none"
                          title="Delete Link"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-xs italic text-gray-400">
                    No nested links added yet. Click &apos;Add Link&apos; above to populate this column.
                  </p>
                )}
              </div>
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
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Visible inside top-level dropdowns</span>
              </div>
            </label>
          </div>

          <div className="flex gap-4 pt-6 shrink-0">
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
              {item ? 'Update Column' : 'Create Column'}
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

export default MegaMenuForm;
