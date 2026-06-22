"use client";

import React, { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { filterProducts } from '@/utils/filterProducts';
import { getProducts } from '@/utils/productService';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/constants/products';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const data = await getProducts();
      setAllProducts(data as any);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (query.trim().length > 1) {
      setLoading(true);
      const filtered = filterProducts(allProducts, query).slice(0, 8);
      setResults(filtered);
      setLoading(false);
    } else {
      setResults([]);
    }
    onSearch(query);
  }, [query, onSearch, allProducts]);

  return (
    <div className="relative max-w-2xl mx-auto mb-12 z-[110]">
      <div className={`relative flex items-center transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
        <Search className={`absolute left-5 transition-colors duration-300 ${isFocused ? 'text-rose-deep' : 'text-text-soft'}`} size={22} />
        <input
          type="text"
          placeholder="Search for cakes, flavors or occasions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full bg-white border-none rounded-full py-5 pl-14 pr-14 text-chocolate font-medium shadow-[0_10px_30px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-rose/20 outline-none transition-all placeholder:text-text-soft/60"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-5 p-1 hover:bg-rose/10 rounded-full transition-colors text-text-soft hover:text-rose-deep"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Quick Results Dropdown */}
      {isFocused && (query.length > 1 || loading) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-cream overflow-hidden animate-fade-up">
          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="animate-spin text-rose-deep" />
            </div>
          ) : results.length > 0 ? (
            <div className="p-4 grid grid-cols-1 gap-2">
              <p className="text-[10px] font-bold text-rose-deep uppercase tracking-widest px-3 mb-2">Suggestions</p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className="flex items-center gap-4 p-3 hover:bg-rose/5 rounded-2xl transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream relative">
                    <Image
                      src={product.img}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-chocolate text-sm truncate">{product.name}</h4>
                    <p className="text-xs text-text-soft truncate">{product.category} • {product.flavor}</p>
                  </div>
                  <div className="text-rose-deep font-bold text-sm">
                    ₹{product.price}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center">
              <p className="text-text-soft italic text-sm">No exact matches found for &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
