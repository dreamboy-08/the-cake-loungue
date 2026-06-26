"use client";

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CalendarPickerProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  minDate: Date;
  onClose: () => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  onSelect,
  minDate,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(minDate));

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  }, [currentMonth]);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isSelected = (date: Date) => {
    return date.toISOString().split('T')[0] === selectedDate;
  };

  const isDisabled = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);
    return d < min;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(201,97,74,0.15)] border border-cream overflow-hidden w-full max-w-sm select-none"
    >
      <div className="bg-chocolate p-8 text-white flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-rose uppercase tracking-[0.2em] text-[10px] font-black mb-1 opacity-80">Select Date</p>
          <h3 className="text-2xl font-playfair font-bold">
            {selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : 'Delivery Date'}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90 relative z-10"
        >
          <X size={24} />
        </button>
        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-rose/10 rounded-full blur-3xl" />
      </div>

      <div className="p-8">
        <div className="flex justify-between items-center mb-8 px-1">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-cream rounded-full transition-all text-chocolate active:scale-90"
            aria-label="Previous Month"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-chocolate text-sm uppercase tracking-widest">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-cream rounded-full transition-all text-chocolate active:scale-90"
            aria-label="Next Month"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekDays.map(day => (
            <span key={day} className="w-9 text-center text-[10px] font-bold text-text-soft uppercase tracking-wider">
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="w-9 h-9" />
          ))}
          {daysInMonth.map((date, i) => {
            const disabled = isDisabled(date);
            const selected = isSelected(date);
            return (
              <button
                key={i}
                disabled={disabled}
                onClick={() => {
                  onSelect(date.toISOString().split('T')[0]);
                  onClose();
                }}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all relative group",
                  disabled ? "text-cream-dark cursor-not-allowed" : "text-chocolate hover:text-rose-deep",
                  selected ? "bg-rose-deep text-white shadow-lg shadow-rose-deep/30 scale-110" : "hover:bg-rose/10"
                )}
              >
                {date.getDate()}
                {!disabled && !selected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-deep rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-cream/20 p-6 border-t border-cream flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center text-rose-deep shrink-0">
          <CalendarIcon size={20} />
        </div>
        <div>
          <p className="text-[11px] text-text-soft font-bold uppercase tracking-wider mb-0.5">Note</p>
          <p className="text-[12px] text-chocolate font-medium leading-tight">
            Earliest delivery is based on current time & cake type.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarPicker;
