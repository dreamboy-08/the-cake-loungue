"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Product } from '@/constants/products';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { filterProducts } from '@/utils/filterProducts';
import { db } from '@/utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search for cakes, categories, or flavors..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        setAllProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as Product[]);
      } catch (error) {
        console.error("Error fetching products for search:", error);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = filterProducts(allProducts, query).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    onSearch(query);
  }, [query, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSuggestionClick = (productId: string | number) => {
    setShowSuggestions(false);
    router.push(`/shop/${productId}`);
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-12 w-full px-4 md:px-0" ref={dropdownRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-rose-deep text-text-soft">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 1 && setShowSuggestions(true)}
          placeholder={placeholder}
          aria-label="Search for cakes, categories, or flavors"
          className="w-full bg-white border-2 border-rose-deep/10 text-chocolate rounded-full py-3.5 pl-12 pr-12 focus:outline-none focus:border-rose-deep focus:ring-4 focus:ring-rose-deep/5 transition-all duration-300 shadow-sm text-base placeholder:text-text-soft/60"
        />
        {query && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-soft hover:text-rose-deep transition-colors duration-300"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-rose-deep/10 overflow-hidden z-[101] animate-fade-in mx-4 md:mx-0">
          <div className="max-h-[400px] overflow-y-auto">
            {suggestions.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSuggestionClick(product.id)}
                className="flex items-center gap-4 p-4 hover:bg-rose-deep/5 cursor-pointer transition-colors border-b border-rose-deep/5 last:border-0 group"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream flex-shrink-0 relative">
                    <Image
                      src={product.img}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-chocolate truncate group-hover:text-rose-deep transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose px-2 py-0.5 bg-rose/10 rounded-full">
                      {product.category}
                    </span>
                    <span className="text-[11px] text-text-soft truncate">
                      {product.flavor}
                    </span>
                  </div>
                </div>
                <div className="text-rose-deep font-bold text-sm">
                  ₹{product.price}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-cream/50 text-center border-t border-rose-deep/5">
            <p className="text-[11px] text-text-soft font-medium">
              Showing top {suggestions.length} results
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
