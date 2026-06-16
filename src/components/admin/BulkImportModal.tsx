"use client";

import React, { useState, useRef } from 'react';
import { db } from '@/utils/firebase';
import {
  collection,
  getDocs,
  writeBatch,
  doc,
  query,
  where
} from 'firebase/firestore';
import { X, Upload, FileText, AlertCircle, CheckCircle2, Loader2, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface BulkImportModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const BulkImportModal = ({ onClose, onSuccess }: BulkImportModalProps) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [logs, setLogs] = useState<{ type: 'error' | 'success' | 'info'; message: string }[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (type: 'error' | 'success' | 'info', message: string) => {
    setLogs(prev => [...prev, { type, message }]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setLogs([]);
      setProgress(0);
    }
  };

  const parseFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    setLogs([]);
    addLog('info', `Starting import of ${file.name}...`);

    try {
      const data = await parseFile(file);
      if (data.length === 0) {
        addLog('error', "The file is empty.");
        setLoading(false);
        return;
      }

      addLog('info', `Found ${data.length} records. Validating...`);

      // Get existing product IDs to check for duplicates
      const existingProductsSnapshot = await getDocs(collection(db, 'products'));
      const existingIds = new Set(existingProductsSnapshot.docs.map(doc => doc.id.toString()));

      const validProducts: any[] = [];
      const errors: string[] = [];

      data.forEach((row, index) => {
        const rowNum = index + 2; // +1 for 0-indexing, +1 for header row

        // Basic mapping and validation
        const product: any = {
          id: row.id?.toString() || row.ID?.toString(),
          name: row.name || row.Name,
          category: row.category || row.Category,
          price: Number(row.price || row.Price),
          oldPrice: Number(row.oldPrice || row.OldPrice) || 0,
          flavor: row.flavor || row.Flavor || '',
          description: row.description || row.Description || '',
          img: row.img || row.Image || row.imageUrl || row.ImageUrl,
          tag: row.tag || row.Tag || '',
          weight: row.weight || row.Weight || row.size || row.Size || '',
          rating: Number(row.rating || row.Rating) || 5,
          reviews: Number(row.reviews || row.Reviews) || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (!product.id) errors.push(`Row ${rowNum}: ID is missing.`);
        else if (existingIds.has(product.id)) errors.push(`Row ${rowNum}: Duplicate ID ${product.id} found in database.`);
        else if (validProducts.some(p => p.id === product.id)) errors.push(`Row ${rowNum}: Duplicate ID ${product.id} found in file.`);

        if (!product.name) errors.push(`Row ${rowNum}: Name is missing.`);
        if (!product.category) errors.push(`Row ${rowNum}: Category is missing.`);
        if (isNaN(product.price)) errors.push(`Row ${rowNum}: Invalid or missing Price.`);
        if (!product.img) errors.push(`Row ${rowNum}: Image URL is missing.`);

        if (errors.length === 0) {
          validProducts.push(product);
        }
      });

      if (errors.length > 0) {
        errors.forEach(err => addLog('error', err));
        addLog('error', `Import aborted. Please fix the ${errors.length} errors above and try again.`);
        setLoading(false);
        return;
      }

      addLog('info', `Validation successful. Importing ${validProducts.length} products...`);

      // Firestore Batch writes (limit 500)
      const BATCH_SIZE = 400;
      for (let i = 0; i < validProducts.length; i += BATCH_SIZE) {
        const batch = writeBatch(db);
        const currentBatch = validProducts.slice(i, i + BATCH_SIZE);

        currentBatch.forEach(product => {
          const productRef = doc(db, 'products', product.id);
          batch.set(productRef, product);
        });

        await batch.commit();
        const currentProgress = Math.min(100, Math.round(((i + currentBatch.length) / validProducts.length) * 100));
        setProgress(currentProgress);
        addLog('success', `Imported ${i + currentBatch.length}/${validProducts.length} products...`);
      }

      addLog('success', "Bulk import completed successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Import error:", error);
      addLog('error', `Import failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        id: "1001",
        name: "Example Cake",
        category: "Birthday Cakes",
        price: 999,
        oldPrice: 1200,
        flavor: "Chocolate",
        weight: "1kg",
        description: "A delicious cake example.",
        img: "https://example.com/image.jpg",
        tag: "Bestseller",
        rating: 5,
        reviews: 10
      }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "CakeLounge_Product_Template.xlsx");
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-up">
        <div className="p-6 border-b flex items-center justify-between bg-chocolate text-white">
          <div className="flex items-center gap-3">
            <Upload size={24} />
            <h2 className="text-xl font-bold font-playfair">Bulk Product Import</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-rose-deep hover:bg-rose/5 transition-all cursor-pointer group"
            >
              <div className="p-4 bg-gray-50 rounded-full text-gray-400 group-hover:text-rose-deep group-hover:bg-rose/10 transition-all">
                <FileText size={32} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-chocolate">Select File</p>
                <p className="text-xs text-gray-400 mt-1">CSV or XLSX (Excel)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-chocolate uppercase tracking-wider">Instructions</h3>
              <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                <li>Use unique IDs for each product.</li>
                <li>Required fields: ID, Name, Category, Price, Image URL.</li>
                <li>Ensure categories match existing ones or create them first.</li>
                <li>Image URLs must be direct links (HTTP/HTTPS).</li>
              </ul>
              <button
                onClick={downloadTemplate}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-white transition-all text-xs"
              >
                <Download size={14} />
                Download Template
              </button>
            </div>
          </div>

          {file && (
            <div className="flex items-center justify-between p-4 bg-rose/5 rounded-xl border border-rose/10">
              <div className="flex items-center gap-3">
                <FileText className="text-rose-deep" size={20} />
                <div>
                  <p className="text-sm font-bold text-chocolate">{file.name}</p>
                  <p className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              {!loading && (
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          )}

          {logs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-chocolate uppercase tracking-widest">Import Logs</h3>
                {loading && (
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-deep transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-rose-deep">{progress}%</span>
                  </div>
                )}
              </div>
              <div className="bg-gray-900 rounded-xl p-4 h-48 overflow-y-auto font-mono text-[10px] space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className={`flex gap-2 ${
                    log.type === 'error' ? 'text-red-400' :
                    log.type === 'success' ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    <span>[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                    <span className="flex-1">{log.message}</span>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-white/50 animate-pulse">
                    <Loader2 size={10} className="animate-spin" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            disabled={!file || loading}
            onClick={handleImport}
            className="px-8 py-3 bg-rose-deep text-white rounded-xl font-bold shadow-lg shadow-rose-deep/30 hover:bg-brown hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {loading ? 'Importing...' : 'Start Import'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;
