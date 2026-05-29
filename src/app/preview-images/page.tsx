'use client';

import React, { useState } from 'react';
import proposedImages from '@/constants/proposed_images.json';
import Image from 'next/image';

export default function PreviewImagesPage() {
  const [searchTerm, setSearchState] = useState('');

  const stats = {
    total: proposedImages.length,
    highConfidence: proposedImages.filter(p => p.confidence === 'high').length,
    lowConfidence: proposedImages.filter(p => p.confidence === 'low').length,
    uniqueProposed: new Set(proposedImages.map(p => p.proposedImg)).size
  };

  const filteredProducts = proposedImages.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-[#8B4513] px-6 py-8 text-white">
            <h1 className="text-3xl font-bold">Image Restoration Preview</h1>
            <p className="mt-2 text-orange-100">Reviewing proposed image mappings for {stats.total} products.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Unique Images</p>
              <p className="text-2xl font-bold text-primary-600">{stats.uniqueProposed}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 font-medium">High Confidence</p>
              <p className="text-2xl font-bold text-green-600">{stats.highConfidence}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Low Confidence</p>
              <p className="text-2xl font-bold text-orange-500">{stats.lowConfidence}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search products or categories..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                onChange={(e) => setSearchState(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Info</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Image</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Proposed Image</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.category} | {product.flavor}</div>
                        <div className="text-[10px] text-gray-400 mt-1">ID: {product.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-100 bg-gray-100">
                          <Image
                            src={product.currentImg}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative w-40 h-24 rounded-lg overflow-hidden border-2 border-primary-100 shadow-sm bg-gray-100">
                          <Image
                            src={product.proposedImg}
                            alt={`${product.name} proposed`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          product.confidence === 'high'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {product.confidence.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
