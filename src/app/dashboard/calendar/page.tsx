"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarCheckLine,
  RiAddLine,
  RiFocus2Line,
} from "react-icons/ri";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DedicatedCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar Math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const today = new Date();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: THE FULL GRID */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Schedule
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {currentDate.toLocaleString("default", { month: "long" })}{" "}
                {year}
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-xl border border-slate-900">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all"
              >
                <RiArrowLeftSLine />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest hover:text-primary"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all"
              >
                <RiArrowRightSLine />
              </button>
            </div>
          </div>

          <div className="border border-slate-900 rounded-[2rem] overflow-hidden shadow-2xl">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-slate-900 bg-[#0c0c0c]">
              {WEEK_DAYS.map((day) => (
                <div
                  key={day}
                  className="py-4 text-center text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7">
              {/* Padding for start of month */}
              {[...Array(firstDayOfMonth)].map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square border-b border-r border-slate-900/50"
                />
              ))}

              {/* Actual Days */}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`relative aspect-square border-b border-r border-slate-900 group transition-all p-2 flex flex-col items-end
                      ${isSelected(day) ? "bg-[#111]" : "hover:bg-[#0c0c0c]"}
                    `}
                  >
                    <span
                      className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all
                      ${isToday(day) ? "bg-primary text-black" : isSelected(day) ? "text-white" : "text-slate-600 group-hover:text-slate-300"}
                    `}
                    >
                      {day}
                    </span>

                    {/* Tiny indicators for tasks (Masala) */}
                    <div className="mt-auto flex gap-1 w-full justify-start overflow-hidden">
                      {day % 3 === 0 && (
                        <div className="w-1 h-1 rounded-full bg-primary/40" />
                      )}
                      {day % 5 === 0 && (
                        <div className="w-1 h-1 rounded-full bg-blue-500/40" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
