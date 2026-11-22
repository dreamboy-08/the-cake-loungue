"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Product } from '@/constants/products';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { filterProducts } from '@/utils/filterProducts';
import { useProducts } from '@/context/ProductsContext';
import { getProductPricing } from '@/utils/productPricing';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const DEBOUNCE_MS = 200;

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search for cakes, categories, or flavors...",
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { products, loading: productsLoading } = useProducts();

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  // Update suggestions and notify parent when debounced query changes
  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    // Always call parent callback (if provided)
    onSearch?.(debouncedQuery);

    if (trimmed.length > 1 && !productsLoading) {
      const filtered = filterProducts(products, trimmed).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else if (trimmed.length <= 1) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedQuery, products, productsLoading, onSearch]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch?.('');
    inputRef.current?.focus();
  }, [onSearch]);

  const handleSuggestionClick = useCallback((productId: string | number) => {
    setShowSuggestions(false);
    setQuery('');
    onSearch?.('');
    router.push(`/shop/${String(productId)}`);
  }, [router, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
    if (e.key === 'Enter' && query.trim().length > 1) {
      setShowSuggestions(false);
    }
  };

  const isSearching = query.trim().length > 1 && productsLoading;
  const showEmptyState = isFocused && debouncedQuery.trim().length > 1 && !productsLoading && suggestions.length === 0;

  return (
    <div ref={dropdownRef} className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-deep/50 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          autoComplete="off"
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim().length > 1 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search for cakes, categories, or flavors"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-controls="search-suggestions-list"
          aria-autocomplete="list"
          role="combobox"
          className="w-full bg-white border-2 border-rose-deep/10 text-chocolate rounded-full py-3.5 pl-12 pr-12 focus:outline-none focus:border-rose-deep focus:ring-4 focus:ring-rose-deep/5 transition-all duration-300 shadow-sm text-base placeholder:text-text-soft/60"
        />
        {isSearching && (
          <Loader2
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-deep/50 animate-spin"
          />
        )}
        {!isSearching && query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-soft hover:text-rose-deep transition-colors p-1 rounded-full"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          id="search-suggestions-list"
          role="listbox"
          aria-label="Search suggestions"
          className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-cream-dark overflow-hidden z-50 animate-fade-in"
        >
          {suggestions.map((product) => (
            <div
              key={product.id}
              role="option"
              aria-selected="false"
              onClick={() => handleSuggestionClick(product.id)}
              className="flex items-center gap-4 p-4 hover:bg-cream-dark cursor-pointer transition-colors border-b border-cream-dark last:border-0 group"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-cream-dark flex-shrink-0">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-chocolate text-sm truncate group-hover:text-rose-deep transition-colors">
                  {product.name}
                </h4>
                <p className="text-xs text-text-soft mt-0.5">
                  {product.category}
                  {product.flavor ? ` · ${product.flavor}` : ''}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-bold text-rose-deep text-sm">
                  From ₹{getProductPricing(product, product.weights?.[0]?.price ?? product.price).price}
                </span>
              </div>
            </div>
          ))}
          <div className="px-4 py-2 text-xs text-text-soft text-center border-t border-cream-dark bg-cream/50">
            Showing top {suggestions.length} result{suggestions.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Empty state */}
      {showEmptyState && (
        <div
          className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-cream-dark overflow-hidden z-50 animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-chocolate mb-1">No results for &ldquo;{debouncedQuery}&rdquo;</p>
            <p className="text-xs text-text-soft">Try a different name, category, or flavor.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
