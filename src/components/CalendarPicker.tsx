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
      className="bg-white rounded-[32px] shadow-2xl border border-cream overflow-hidden w-full max-w-sm"
    >
      <div className="bg-chocolate p-6 text-white flex justify-between items-center">
        <div>
          <p className="text-rose uppercase tracking-widest text-[10px] font-bold mb-1">Select Date</p>
          <h3 className="text-xl font-playfair font-bold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-cream rounded-full transition-colors text-chocolate"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-1">
            {weekDays.map(day => (
              <span key={day} className="w-9 text-center text-[10px] font-bold text-text-soft uppercase tracking-tighter">
                {day}
              </span>
            ))}
          </div>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-cream rounded-full transition-colors text-chocolate"
          >
            <ChevronRight size={20} />
          </button>
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
                  "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all",
                  disabled ? "text-cream-dark cursor-not-allowed" : "text-chocolate hover:bg-rose/20 hover:text-rose-deep",
                  selected && "bg-rose-deep text-white hover:bg-rose-deep hover:text-white shadow-lg shadow-rose-deep/30 scale-110"
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-cream/30 p-4 border-t border-cream flex items-center gap-3">
        <div className="w-8 h-8 bg-rose/10 rounded-lg flex items-center justify-center text-rose-deep">
          <CalendarIcon size={16} />
        </div>
        <p className="text-[10px] text-text-soft leading-tight">
          Earliest delivery depends on preparation time.<br/>
          <span className="font-bold text-rose-deep">Selected: {selectedDate || 'None'}</span>
        </p>
      </div>
    </motion.div>
  );
};

export default CalendarPicker;
