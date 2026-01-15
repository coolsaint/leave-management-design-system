import React, { useState } from 'react';
import {
  Plus, Star, Share2, User, Check, Search, Bell, Settings, X,
  Calendar, Users, BarChart3, Clock, Briefcase, ChevronLeft, ChevronRight,
  Thermometer, Heart, Baby, Coffee, Flower2
} from 'lucide-react';

// Design tokens from spec - Monochromatic with soft calendar colors
const tokens = {
  bgPrimary: '#F6F6F8',
  bgCard: '#FFFFFF',
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  textMuted: '#C7C7CC',
  accent: '#3A3A3C',
  border: '#E5E5EA',
  warning: '#A1887F',

  // Soft calendar colors (inspired by Stoic)
  calendarSelected: '#7BA3C9',     // Muted blue for selected dates
  calendarRange: '#D4E4F1',        // Very light blue for range
  calendarEmpty: '#E8E8EC',        // Faint outline for empty dots
  calendarText: '#B8B8BC',         // Soft gray for date numbers

  // Dashboard values (softer than primary)
  valueText: '#636366',            // Stats, balances - visible but not harsh

  cardRadius: '24px',
  buttonRadius: '999px',
  inputRadius: '12px',

  bold: 700,
  regular: 400,
};

// Leave Types Configuration - Shajgoj Limited (Male Employee)
const leaveTypes = [
  { id: 'sick', label: 'Sick Leave', icon: Thermometer, maxDays: 14, available: 10, note: 'Doctor cert required for 3+ days', allowPastDates: true, maxPastDays: 7 },
  { id: 'casual', label: 'Casual Leave', icon: Coffee, maxDays: 10, available: 7, note: 'Max 3 days at a time', allowPastDates: false },
  { id: 'paternity', label: 'Paternity Leave', icon: Baby, maxDays: 14, available: 14, note: '7 days before + 7 after delivery', allowPastDates: true, maxPastDays: 90 },
  { id: 'bereavement', label: 'Bereavement', icon: Flower2, maxDays: 3, available: 3, note: 'Immediate family/relative', allowPastDates: true, maxPastDays: 7 },
  { id: 'marriage', label: 'Marriage Leave', icon: Heart, maxDays: 5, available: 5, note: 'Once in employment', allowPastDates: false },
];

// ============ DOT/BUBBLE CALENDAR COMPONENT ============
function DotCalendar({ selectedStart, setSelectedStart, selectedEnd, setSelectedEnd, leaveType }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  // Generate 28 days (4 weeks)
  const generateDays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));

    const days = [];
    for (let i = 0; i < 28; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const days = generateDays();
  const week1 = days.slice(0, 7);
  const week2 = days.slice(7, 14);
  const week3 = days.slice(14, 21);
  const week4 = days.slice(21, 28);

  const isToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.toDateString() === today.toDateString();
  };

  // Check if date is disabled (past date logic based on leave type)
  const isDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Future dates are always allowed
    if (date >= today) return false;

    // Check if this leave type allows past dates
    if (leaveType?.allowPastDates) {
      const maxPastDays = leaveType.maxPastDays || 7;
      const minAllowedDate = new Date(today);
      minAllowedDate.setDate(today.getDate() - maxPastDays);
      return date < minAllowedDate;
    }

    // Default: past dates are disabled
    return true;
  };

  const isSelected = (date) => {
    if (!selectedStart) return false;
    if (selectedStart.toDateString() === date.toDateString()) return true;
    if (selectedEnd && selectedEnd.toDateString() === date.toDateString()) return true;
    return false;
  };

  const isInRange = (date) => {
    if (!selectedStart || !selectedEnd) return false;
    const start = selectedStart < selectedEnd ? selectedStart : selectedEnd;
    const end = selectedStart < selectedEnd ? selectedEnd : selectedStart;
    return date > start && date < end;
  };

  const handleDotClick = (date) => {
    if (isDisabled(date)) return;
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(date);
      setSelectedEnd(null);
    } else {
      setSelectedEnd(date);
    }
  };

  const getMonthLabel = () => {
    const first = days[0];
    const last = days[27];
    if (first.getMonth() === last.getMonth()) {
      return `${monthNames[first.getMonth()]} ${first.getFullYear()}`;
    }
    return `${monthNames[first.getMonth()]} – ${monthNames[last.getMonth()]} ${last.getFullYear()}`;
  };

  // Dot/Bubble component - Team Availability Style
  // Outlined circles = available/selectable, Filled = selected/in-range
  const Dot = ({ date }) => {
    const selected = isSelected(date);
    const inRange = isInRange(date);
    const today = isToday(date);
    const disabled = isDisabled(date);
    const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));

    // Team Availability inspired styling - 1.5px borders for delicate look
    let bgColor = 'transparent';
    let textColor = tokens.textSecondary;
    let border = `1px solid ${tokens.textMuted}`;  // Delicate outline
    let scale = 1;

    if (selected) {
      // Filled circle like "On Leave" indicator
      bgColor = tokens.calendarSelected;
      textColor = '#fff';
      border = 'none';
      scale = 1.05;
    } else if (inRange) {
      // Softer filled for range
      bgColor = tokens.calendarRange;
      textColor = tokens.textPrimary;
      border = 'none';
    } else if (today) {
      // Today: accent outlined
      bgColor = 'transparent';
      textColor = tokens.calendarSelected;
      border = `1px solid ${tokens.calendarSelected}`;
    } else if (disabled) {
      // Disabled: very faint
      textColor = tokens.textMuted;
      border = `1px solid ${tokens.calendarEmpty}`;
    } else if (isPastDate && !disabled) {
      // Allowed past dates: slightly emphasized outline
      textColor = tokens.textSecondary;
      border = `1px solid ${tokens.textSecondary}`;
    }

    return (
      <button
        type="button"
        onClick={() => handleDotClick(date)}
        disabled={disabled}
        className="flex items-center justify-center transition-all duration-150"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: bgColor,
          border: border,
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.35 : 1,
          transform: `scale(${scale})`,
        }}
      >
        <span
          style={{
            fontSize: '11px',
            color: textColor,
            fontWeight: today || selected ? 600 : 400,
          }}
        >
          {date.getDate()}
        </span>
      </button>
    );
  };

  return (
    <div
      className="w-full p-5"
      style={{
        backgroundColor: tokens.bgCard,
        borderRadius: tokens.cardRadius,
        border: `1px solid ${tokens.border}`,
      }}
    >
      {/* Month Navigation - Team Availability Style */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          style={{ color: tokens.textMuted }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span
          className="text-sm lowercase"
          style={{ color: tokens.textSecondary }}
        >
          {getMonthLabel()}
        </span>

        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          style={{ color: tokens.textMuted }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {dayNames.map((day, i) => (
          <div key={i} className="flex justify-center">
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ color: tokens.textMuted }}
            >
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Weeks - Team Availability Style Grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-7 gap-1 justify-items-center">
          {week1.map((date, i) => <Dot key={i} date={date} />)}
        </div>
        <div className="grid grid-cols-7 gap-1 justify-items-center">
          {week2.map((date, i) => <Dot key={i} date={date} />)}
        </div>
        <div className="grid grid-cols-7 gap-1 justify-items-center">
          {week3.map((date, i) => <Dot key={i} date={date} />)}
        </div>
        <div className="grid grid-cols-7 gap-1 justify-items-center">
          {week4.map((date, i) => <Dot key={i} date={date} />)}
        </div>
      </div>

      {/* Legend - Team Availability Capsule Style */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <div
          className="flex items-center gap-2 px-3 py-1.5 text-xs"
          style={{
            backgroundColor: tokens.bgPrimary,
            borderRadius: tokens.buttonRadius,
          }}
        >
          <div
            className="w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: tokens.calendarSelected }}
          />
          <span style={{ color: tokens.textSecondary }}>selected</span>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 text-xs"
          style={{
            backgroundColor: tokens.bgPrimary,
            borderRadius: tokens.buttonRadius,
          }}
        >
          <div
            className="w-3.5 h-3.5 rounded-full"
            style={{
              border: `1px solid ${tokens.calendarSelected}`,
              backgroundColor: 'transparent',
            }}
          />
          <span style={{ color: tokens.textSecondary }}>today</span>
        </div>
      </div>
    </div>
  );
}

// ============ MONTH CALENDAR COMPONENT (Desktop) ============
function MonthCalendar({ selectedStart, setSelectedStart, selectedEnd, setSelectedEnd, leaveColor, leaveType }) {
  const [monthOffset, setMonthOffset] = useState(0);

  const dayNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  const getMonthData = () => {
    const today = new Date();
    const targetMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();

    const days = [];

    // Add empty cells for padding
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return { days, month, year };
  };

  const { days, month, year } = getMonthData();

  // Check if date is disabled (past date logic based on leave type)
  const isDisabled = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Future dates are always allowed
    if (date >= today) return false;

    // Check if this leave type allows past dates
    if (leaveType?.allowPastDates) {
      const maxPastDays = leaveType.maxPastDays || 7;
      const minAllowedDate = new Date(today);
      minAllowedDate.setDate(today.getDate() - maxPastDays);
      return date < minAllowedDate;
    }

    // Default: past dates are disabled
    return true;
  };

  const isSelected = (date) => {
    if (!date || !selectedStart) return false;
    if (selectedStart.toDateString() === date.toDateString()) return true;
    if (selectedEnd && selectedEnd.toDateString() === date.toDateString()) return true;
    return false;
  };

  const isInRange = (date) => {
    if (!date || !selectedStart || !selectedEnd) return false;
    const start = selectedStart < selectedEnd ? selectedStart : selectedEnd;
    const end = selectedStart < selectedEnd ? selectedEnd : selectedStart;
    return date > start && date < end;
  };

  const handleDateClick = (date) => {
    if (!date || isDisabled(date)) return;
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(date);
      setSelectedEnd(null);
    } else {
      setSelectedEnd(date);
    }
  };

  // Split days into weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setMonthOffset(monthOffset - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          style={{ color: tokens.textMuted }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span
          className="text-sm"
          style={{ color: tokens.textSecondary }}
        >
          {monthNames[month]} {year}
        </span>

        <button
          onClick={() => setMonthOffset(monthOffset + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          style={{ color: tokens.textMuted }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {dayNames.map((day, i) => (
          <div key={i} className="flex justify-center py-2">
            <span
              className="text-[11px] font-medium"
              style={{ color: tokens.textMuted }}
            >
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((date, dayIndex) => {
              if (!date) {
                return <div key={dayIndex} className="w-10 h-10" />;
              }

              const selected = isSelected(date);
              const inRange = isInRange(date);
              const disabled = isDisabled(date);
              const isDateToday = date.toDateString() === new Date().toDateString();
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isPastDate = date < today;

              // Team Availability style: outlined = available, filled = selected
              // Using 1.5px borders for delicate aesthetic
              let bgColor = 'transparent';
              let textColor = tokens.textSecondary;
              let border = `1px solid ${tokens.textMuted}`;  // Delicate outline
              let scale = 1;

              if (selected) {
                bgColor = tokens.calendarSelected;
                textColor = '#fff';
                border = 'none';
                scale = 1.05;
              } else if (inRange) {
                bgColor = tokens.calendarRange;
                textColor = tokens.textPrimary;
                border = 'none';
              } else if (isDateToday) {
                textColor = tokens.calendarSelected;
                border = `1px solid ${tokens.calendarSelected}`;
              } else if (disabled) {
                textColor = tokens.textMuted;
                border = `1px solid ${tokens.calendarEmpty}`;
              } else if (isPastDate && !disabled) {
                // Allowed past dates - emphasized outline
                textColor = tokens.textSecondary;
                border = `1px solid ${tokens.textSecondary}`;
              }

              return (
                <button
                  key={dayIndex}
                  type="button"
                  onClick={() => handleDateClick(date)}
                  disabled={disabled}
                  className="w-10 h-10 flex items-center justify-center mx-auto transition-all duration-150"
                  style={{
                    borderRadius: '50%',
                    backgroundColor: bgColor,
                    border: border,
                    color: textColor,
                    cursor: disabled ? 'default' : 'pointer',
                    opacity: disabled ? 0.35 : 1,
                    fontWeight: isDateToday || selected ? 600 : 400,
                    transform: `scale(${scale})`,
                  }}
                >
                  <span className="text-sm">
                    {date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ REQUEST TIME OFF MODAL ============
function RequestTimeOffModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedLeaveType, setSelectedLeaveType] = useState('casual');
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [reason, setReason] = useState('');
  const { isMobile } = useResponsive();

  const currentLeaveType = leaveTypes.find(t => t.id === selectedLeaveType);

  const selectedDays = selectedStart && selectedEnd
    ? Math.abs(Math.ceil((selectedEnd - selectedStart) / (1000 * 60 * 60 * 24))) + 1
    : selectedStart ? 1 : 0;

  const exceedsBalance = selectedDays > currentLeaveType?.available;

  const formatDateShort = (date) => {
    if (!date) return '';
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
  };

  // Get initials for leave type
  const getLeaveInitials = (label) => {
    return label.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSubmit = () => {
    if (exceedsBalance) return;
    console.log('Submitting request:', {
      type: selectedLeaveType,
      start: selectedStart,
      end: selectedEnd,
      reason,
      days: selectedDays,
    });
    onClose();
    setStep(1);
    setSelectedStart(null);
    setSelectedEnd(null);
    setReason('');
  };

  const handleClose = () => {
    onClose();
    setStep(1);
    setSelectedStart(null);
    setSelectedEnd(null);
    setReason('');
  };

  if (!isOpen) return null;

  // Mobile: Full screen modal
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col"
        style={{ backgroundColor: tokens.bgPrimary }}
      >
        {/* Mobile Header */}
        <div
          className="flex items-center justify-between p-4"
          style={{ backgroundColor: tokens.bgCard, borderBottom: `1px solid ${tokens.border}` }}
        >
          <div className="flex items-center gap-3">
            {(step === 2 || step === 3) && (
              <button
                onClick={() => setStep(step - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" style={{ color: tokens.textSecondary }} />
              </button>
            )}
            <h3 className="font-semibold">
              {step === 1 ? 'select leave type.' : step === 2 ? 'select dates.' : 'add a note.'}
            </h3>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" style={{ color: tokens.textSecondary }} />
          </button>
        </div>

        {/* Mobile Content - hide scrollbar */}
        <div
          className="flex-1 p-4 pb-8"
          style={{
            overflowY: 'auto',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE/Edge */
          }}
        >
          {step === 1 ? (
            /* Step 1: Select Leave Type - Team Overview Style */
            <div className="space-y-2">
              {leaveTypes.map((type) => {
                const isSelected = selectedLeaveType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedLeaveType(type.id);
                      setStep(2);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all"
                    style={{
                      backgroundColor: isSelected ? tokens.bgPrimary : tokens.bgCard,
                      border: `1px solid ${tokens.border}`,
                    }}
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center text-sm font-semibold"
                      style={{
                        backgroundColor: tokens.bgPrimary,
                        borderRadius: tokens.buttonRadius,
                        color: tokens.textSecondary,
                      }}
                    >
                      {getLeaveInitials(type.label)}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{type.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: tokens.textSecondary }}>
                        {type.available} of {type.maxDays} days available
                      </p>
                      {type.note && (
                        <p className="text-[10px] mt-1" style={{ color: tokens.textMuted }}>
                          {type.note}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: tokens.textMuted }} />
                  </button>
                );
              })}
            </div>
          ) : step === 2 ? (
            /* Step 2: Select Dates */
            <div>
              {/* Dot Calendar - Team Availability Card Style */}
              <div className="mb-4">
                <DotCalendar
                  selectedStart={selectedStart}
                  setSelectedStart={setSelectedStart}
                  selectedEnd={selectedEnd}
                  setSelectedEnd={setSelectedEnd}
                  leaveType={currentLeaveType}
                />
              </div>

              {/* Selected Range Card - with Leave Type integrated */}
              <div
                className="flex items-center justify-between p-4 rounded-2xl"
                style={{ backgroundColor: tokens.bgCard, border: `1px solid ${tokens.border}` }}
              >
                <div>
                  <p
                    className="text-[10px] uppercase tracking-wider mb-1"
                    style={{ color: tokens.textSecondary }}
                  >
                    {currentLeaveType.label}
                  </p>
                  <p className="text-sm font-medium">
                    {selectedStart ? (
                      selectedEnd
                        ? `${formatDateShort(selectedStart)} → ${formatDateShort(selectedEnd)}`
                        : formatDateShort(selectedStart)
                    ) : (
                      <span style={{ color: tokens.textMuted }}>tap dates above</span>
                    )}
                  </p>
                </div>
                {selectedDays > 0 && (
                  <div
                    className="px-3 py-1.5 rounded-full text-white text-sm font-semibold"
                    style={{ backgroundColor: tokens.calendarSelected }}
                  >
                    {selectedDays} days
                  </div>
                )}
              </div>

              {/* Exceeds Balance Warning */}
              {exceedsBalance && (
                <p
                  className="text-center text-xs mt-4"
                  style={{ color: tokens.textSecondary }}
                >
                  exceeds {currentLeaveType.available} days available for {currentLeaveType.label}
                </p>
              )}

              {/* Continue Button - Centered pill style */}
              {selectedDays > 0 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setStep(3)}
                    disabled={exceedsBalance}
                    className="px-12 py-2.5 rounded-full font-medium text-sm text-white transition-all active:scale-95 disabled:opacity-50"
                    style={{
                      backgroundColor: exceedsBalance ? tokens.textMuted : tokens.accent,
                    }}
                  >
                    continue
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Step 3: Add Note */
            <div className="flex flex-col items-center pt-8">
              <div className="text-center mb-6">
                <h4
                  className="text-xl font-bold mb-2"
                  style={{ color: tokens.textPrimary }}
                >
                  add a note.
                </h4>
                <p
                  className="text-xs"
                  style={{ color: tokens.textSecondary }}
                >
                  Let your team know any details—<br />
                  this is optional.
                </p>
              </div>

              {/* Summary Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                style={{ backgroundColor: tokens.bgCard, border: `1px solid ${tokens.border}` }}
              >
                <span
                  className="text-xs font-medium"
                  style={{ color: tokens.textSecondary }}
                >
                  {currentLeaveType.label} • {formatDateShort(selectedStart)} → {formatDateShort(selectedEnd || selectedStart)} • {selectedDays} days
                </span>
              </div>

              <div
                className="w-full p-4 rounded-2xl"
                style={{
                  backgroundColor: tokens.bgCard,
                  border: `1px solid ${tokens.border}`,
                }}
              >
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="I'll be attending a family event..."
                  className="w-full resize-none outline-none text-sm leading-relaxed"
                  style={{
                    backgroundColor: 'transparent',
                    color: tokens.textPrimary,
                    height: '100px',
                  }}
                />
              </div>

              {/* Submit Button - Centered pill style */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleSubmit}
                  className="px-12 py-2.5 rounded-full font-medium text-sm text-white transition-all active:scale-95"
                  style={{ backgroundColor: tokens.accent }}
                >
                  submit request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop: Centered popup modal
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="fixed z-50 w-[420px]"
        style={{
          backgroundColor: tokens.bgCard,
          borderRadius: '20px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {step === 1 ? (
          /* Step 1: Select Leave Type - Team Overview Style */
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${tokens.border}` }}>
              <h3 className="font-semibold">select leave type.</h3>
              <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <X className="w-4 h-4" style={{ color: tokens.textSecondary }} />
              </button>
            </div>

            {/* Leave Type Options - Team Overview Style */}
            <div className="p-5 space-y-2">
              {leaveTypes.map((type) => {
                const isSelected = selectedLeaveType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedLeaveType(type.id);
                      setStep(2);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-gray-50"
                    style={{
                      backgroundColor: isSelected ? tokens.bgPrimary : tokens.bgCard,
                      border: `1px solid ${tokens.border}`,
                    }}
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center text-sm font-semibold"
                      style={{
                        backgroundColor: tokens.bgPrimary,
                        borderRadius: tokens.buttonRadius,
                        color: tokens.textSecondary,
                      }}
                    >
                      {getLeaveInitials(type.label)}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{type.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: tokens.textSecondary }}>
                        {type.available} of {type.maxDays} days available
                      </p>
                      {type.note && (
                        <p className="text-[10px] mt-1" style={{ color: tokens.textMuted }}>
                          {type.note}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: tokens.textMuted }} />
                  </button>
                );
              })}
            </div>
          </>
        ) : step === 2 ? (
          /* Step 2: Select Dates */
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${tokens.border}` }}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4" style={{ color: tokens.textSecondary }} />
                </button>
                <h3 className="font-semibold">select dates.</h3>
              </div>
              <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <X className="w-4 h-4" style={{ color: tokens.textSecondary }} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Dot Calendar - Team Availability Card Style */}
              <DotCalendar
                selectedStart={selectedStart}
                setSelectedStart={setSelectedStart}
                selectedEnd={selectedEnd}
                setSelectedEnd={setSelectedEnd}
                leaveType={currentLeaveType}
              />

              {/* Selected Range Summary - with Leave Type integrated */}
              <div
                className="flex items-center justify-between p-4 rounded-2xl mt-5"
                style={{ backgroundColor: tokens.bgPrimary }}
              >
                <div>
                  <p
                    className="text-[10px] uppercase tracking-wider mb-1"
                    style={{ color: tokens.textSecondary }}
                  >
                    {currentLeaveType.label}
                  </p>
                  <p className="text-sm font-medium">
                    {selectedStart ? (
                      selectedEnd
                        ? `${formatDateShort(selectedStart)} → ${formatDateShort(selectedEnd)}`
                        : formatDateShort(selectedStart)
                    ) : (
                      <span style={{ color: tokens.textMuted }}>tap dates above</span>
                    )}
                  </p>
                </div>
                {selectedDays > 0 && (
                  <div
                    className="px-3 py-1.5 rounded-full text-white text-sm font-semibold"
                    style={{ backgroundColor: tokens.calendarSelected }}
                  >
                    {selectedDays} days
                  </div>
                )}
              </div>

              {/* Exceeds Balance Warning */}
              {exceedsBalance && (
                <p
                  className="text-center text-xs mt-4"
                  style={{ color: tokens.textSecondary }}
                >
                  exceeds {currentLeaveType.available} days available for {currentLeaveType.label}
                </p>
              )}

              {/* Continue Button - Centered pill style */}
              {selectedDays > 0 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setStep(3)}
                    disabled={exceedsBalance}
                    className="px-12 py-2.5 rounded-full font-medium text-sm text-white transition-all active:scale-95 disabled:opacity-50"
                    style={{
                      backgroundColor: exceedsBalance ? tokens.textMuted : tokens.accent,
                    }}
                  >
                    continue
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Step 3: Add Note */
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${tokens.border}` }}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4" style={{ color: tokens.textSecondary }} />
                </button>
                <h3 className="font-semibold">add a note.</h3>
              </div>
              <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <X className="w-4 h-4" style={{ color: tokens.textSecondary }} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="text-center mb-5">
                <p
                  className="text-xs"
                  style={{ color: tokens.textSecondary }}
                >
                  Let your team know any details—this is optional.
                </p>
              </div>

              {/* Summary Badge */}
              <div
                className="flex justify-center mb-5"
              >
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: tokens.bgPrimary, border: `1px solid ${tokens.border}` }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: tokens.textSecondary }}
                  >
                    {currentLeaveType.label} • {formatDateShort(selectedStart)} → {formatDateShort(selectedEnd || selectedStart)} • {selectedDays} days
                  </span>
                </div>
              </div>

              <div
                className="p-4 rounded-2xl"
                style={{
                  backgroundColor: tokens.bgPrimary,
                  border: `1px solid ${tokens.border}`,
                }}
              >
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="I'll be attending a family event..."
                  className="w-full resize-none outline-none text-sm leading-relaxed"
                  style={{
                    backgroundColor: 'transparent',
                    color: tokens.textPrimary,
                    height: '100px',
                  }}
                />
              </div>

              {/* Submit Button - Centered pill style */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleSubmit}
                  className="px-12 py-2.5 rounded-full font-medium text-sm text-white transition-all active:scale-95"
                  style={{ backgroundColor: tokens.accent }}
                >
                  submit request
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ============ LAYOUT CONSTANTS ============
const HEADER_HEIGHT = 72;
const SIDEBAR_WIDTH = 208;    // w-52 = 208px
const RIGHT_PANEL_WIDTH = 340;

// ============ RESPONSIVE HOOK ============
function useResponsive() {
  const [screen, setScreen] = useState('desktop');

  React.useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      if (width < 640) setScreen('mobile');
      else if (width < 1024) setScreen('tablet');
      else setScreen('desktop');
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return {
    isMobile: screen === 'mobile',
    isTablet: screen === 'tablet',
    isDesktop: screen === 'desktop',
    screen,
  };
}

// ============ MAIN DASHBOARD ============
export default function LeaveManagementDashboard() {
  const [selectedNav, setSelectedNav] = useState('today');
  const [selectedDay, setSelectedDay] = useState(17);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const weekDays = [
    { day: 'Su', date: 12, selected: false },
    { day: 'Mo', date: 13, selected: false },
    { day: 'Tu', date: 14, selected: false },
    { day: 'We', date: 15, selected: false },
    { day: 'Th', date: 16, selected: false },
    { day: 'Fr', date: 17, selected: true },
    { day: 'Sa', date: 18, selected: false },
  ];

  const teamMembers = [
    { name: 'Sarah Chen', initials: 'SC', role: 'Designer', status: 'leave', type: 'Vacation', until: 'Jan 20' },
    { name: 'Mike Johnson', initials: 'MJ', role: 'Developer', status: 'leave', type: 'Sick', until: 'Jan 19' },
    { name: 'Priya Patel', initials: 'PP', role: 'Developer', status: 'available', daysLeft: 15 },
    { name: 'Alex Kim', initials: 'AK', role: 'DevOps', status: 'available', daysLeft: 10 },
    { name: 'Emma Wilson', initials: 'EW', role: 'QA', status: 'available', daysLeft: 14 },
  ];

  const pendingRequests = [
    { name: 'Emma Wilson', initials: 'EW', dates: 'Jan 20-24', type: 'Vacation', days: 5 },
    { name: 'David Liu', initials: 'DL', dates: 'Jan 22', type: 'Personal', days: 1 },
  ];

  const navItems = [
    { id: 'today', icon: Calendar, label: 'today' },
    { id: 'requests', icon: Clock, label: 'requests', badge: 2 },
    { id: 'team', icon: Users, label: 'team' },
    { id: 'history', icon: BarChart3, label: 'history' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'good morning.';
    if (hour < 18) return 'good afternoon.';
    return 'good evening.';
  };

  return (
    <div
      className="min-h-screen text-[13px]"
      style={{
        backgroundColor: tokens.bgPrimary,
        color: tokens.textPrimary,
        fontFamily: "'Inter', 'SF Pro Rounded', -apple-system, sans-serif",
      }}
    >
      {/* Mobile/Tablet Sidebar Overlay */}
      {!isDesktop && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* HEADER */}
      <header
        className="sticky top-0 z-20 flex items-center px-4 md:px-6"
        style={{
          height: HEADER_HEIGHT,
          backgroundColor: tokens.bgCard,
          borderBottom: `1px solid ${tokens.border}`,
        }}
      >
        <div className="flex items-center justify-between w-full">
          {/* Left: Logo + Menu Toggle */}
          <div className="flex items-center gap-3">
            {!isDesktop && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="space-y-1">
                  <div className="w-4 h-0.5 bg-current" />
                  <div className="w-3 h-0.5 bg-current" />
                  <div className="w-4 h-0.5 bg-current" />
                </div>
              </button>
            )}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: tokens.accent, borderRadius: '8px' }}
              >
                T.
              </div>
              <div className={isMobile ? 'hidden' : ''}>
                <h1 className="font-bold text-sm lowercase leading-tight">teamflow.</h1>
                <p className="text-[10px] leading-tight" style={{ color: tokens.textSecondary }}>leave management</p>
              </div>
            </div>
          </div>

          {/* Center: Greeting (desktop only) */}
          {isDesktop && (
            <h2 className="text-lg lowercase leading-none" style={{ fontWeight: tokens.bold }}>{getGreeting()}</h2>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search - hidden on mobile */}
            {!isMobile && (
              <div className="relative flex items-center">
                <Search
                  className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: tokens.textSecondary }}
                  strokeWidth={1.5}
                />
                <input
                  type="text"
                  placeholder="search..."
                  className="w-32 md:w-44 pl-8 pr-3 py-2 text-xs lowercase placeholder:lowercase"
                  style={{
                    backgroundColor: tokens.bgPrimary,
                    border: `1px solid ${tokens.border}`,
                    borderRadius: tokens.inputRadius,
                  }}
                />
              </div>
            )}

            {/* Bell */}
            <button
              className="w-9 h-9 flex items-center justify-center relative transition-colors hover:bg-gray-50"
              style={{ backgroundColor: tokens.bgPrimary, borderRadius: tokens.inputRadius }}
            >
              <Bell className="w-4 h-4" style={{ color: tokens.textSecondary }} strokeWidth={1.5} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: tokens.accent }}
              />
            </button>

            {/* New Request Button */}
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="flex items-center gap-1.5 px-3 md:px-4 py-2 text-white text-xs font-medium lowercase transition-all active:scale-[0.98]"
              style={{ backgroundColor: tokens.accent, borderRadius: tokens.buttonRadius }}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              <span className={isMobile ? 'hidden' : ''}>new request</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div
        className="flex"
        style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}
      >
        {/* Sidebar */}
        <aside
          className={`
            ${isDesktop ? 'relative' : 'fixed left-0 top-0 z-40 h-full pt-[72px]'}
            ${!isDesktop && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
            transition-transform duration-300 flex flex-col
          `}
          style={{
            width: SIDEBAR_WIDTH,
            backgroundColor: tokens.bgCard,
            borderRight: `1px solid ${tokens.border}`,
          }}
        >
          {/* Navigation */}
          <nav className="flex-1 px-3 pt-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setSelectedNav(item.id);
                      if (!isDesktop) setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 transition-all lowercase"
                    style={{
                      backgroundColor: selectedNav === item.id ? tokens.accent : 'transparent',
                      color: selectedNav === item.id ? '#FFFFFF' : tokens.textSecondary,
                      borderRadius: '10px',
                      fontWeight: selectedNav === item.id ? tokens.bold : tokens.regular,
                    }}
                  >
                    <item.icon className="w-4 h-4" strokeWidth={1.5} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className="ml-auto text-[10px] font-bold px-1.5 py-0.5"
                        style={{
                          backgroundColor: selectedNav === item.id ? tokens.bgCard : tokens.accent,
                          color: selectedNav === item.id ? tokens.accent : tokens.bgCard,
                          borderRadius: tokens.buttonRadius,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User */}
          <div className="p-3 mt-auto" style={{ borderTop: `1px solid ${tokens.border}` }}>
            <div className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{ backgroundColor: tokens.bgPrimary, borderRadius: tokens.buttonRadius }}
              >
                <User className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium">Suman</p>
                <p className="text-[10px]" style={{ color: tokens.textSecondary }}>Team Lead</p>
              </div>
              <Settings className="w-3.5 h-3.5" style={{ color: tokens.textSecondary }} strokeWidth={1.5} />
            </div>
          </div>
        </aside>

        {/* Center Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-5 max-w-4xl mx-auto">
          {/* Week Calendar Strip - Stoic Style */}
          <div className="py-3 px-2">
            <div className="flex items-center gap-2">
              <button
                className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full transition-colors hover:bg-white/50"
                style={{ color: tokens.textSecondary }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex-1 flex items-center justify-between">
                {weekDays.map((day, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(day.date)}
                    className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all"
                    style={{
                      backgroundColor: day.selected ? '#8E8E93' : 'transparent',
                    }}
                  >
                    <span
                      className="text-[10px] font-medium uppercase"
                      style={{ color: day.selected ? 'rgba(255,255,255,0.6)' : '#858585' }}
                    >
                      {day.day.charAt(0)}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: day.selected ? '#FFFFFF' : '#B0B0B0' }}
                    >
                      {day.date}
                    </span>
                  </button>
                ))}
              </div>

              <button
                className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full transition-colors hover:bg-white/50"
                style={{ color: tokens.textSecondary }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center mt-2">
              <span
                className="text-xs lowercase"
                style={{ color: tokens.textSecondary }}
              >
                january 2026
              </span>
            </div>
          </div>

          {/* Team Availability */}
          <div
            className="p-5"
            style={{
              backgroundColor: tokens.bgCard,
              borderRadius: tokens.cardRadius,
              border: `1px solid ${tokens.border}`,
            }}
          >
            <h3
              className="text-center text-sm lowercase mb-4"
              style={{ color: tokens.textSecondary }}
            >
              team availability.
            </h3>

            {/* Legend - Capsule Buttons */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="flex items-center gap-2 px-4 py-2.5 text-sm"
                style={{
                  backgroundColor: tokens.bgPrimary,
                  borderRadius: tokens.buttonRadius,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    border: `2px solid #C7C7CC`,
                  }}
                />
                <span>6 Available</span>
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2.5 text-sm"
                style={{
                  backgroundColor: tokens.bgPrimary,
                  borderRadius: tokens.buttonRadius,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: '#8E8E93' }}
                />
                <span>2 On Leave</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex gap-3">
              {[
                { value: 6, label: 'available' },
                { value: 2, label: 'on leave' },
                { value: 2, label: 'pending' },
                { value: 8, label: 'this week' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex-1 text-center p-4 rounded-2xl"
                  style={{ backgroundColor: tokens.bgPrimary }}
                >
                  <p
                    className="text-2xl font-semibold mb-1"
                    style={{ color: tokens.valueText }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-[10px] lowercase"
                    style={{ color: tokens.textSecondary }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Team List */}
          <div
            className="p-5"
            style={{
              backgroundColor: tokens.bgCard,
              borderRadius: tokens.cardRadius,
              border: `1px solid ${tokens.border}`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold lowercase">team overview</h3>
              <button className="text-xs lowercase" style={{ color: tokens.textSecondary }}>view all</button>
            </div>

            <div className="space-y-1">
              {teamMembers.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                  style={{
                    backgroundColor: member.status === 'leave' ? tokens.bgPrimary : 'transparent',
                  }}
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center text-xs font-semibold"
                    style={{
                      backgroundColor: member.status === 'leave' ? '#E5E5EA' : tokens.bgPrimary,
                      borderRadius: tokens.buttonRadius,
                      color: tokens.textSecondary,
                    }}
                  >
                    {member.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{member.name}</p>
                    <p className="text-[10px]" style={{ color: tokens.textSecondary }}>{member.role}</p>
                  </div>
                  <div className="text-right">
                    {member.status === 'leave' ? (
                      <>
                        <p className="text-[10px] font-medium">{member.type}</p>
                        <p className="text-[10px]" style={{ color: tokens.textSecondary }}>Until {member.until}</p>
                      </>
                    ) : (
                      <p className="text-[10px]" style={{ color: tokens.textSecondary }}>{member.daysLeft} days left</p>
                    )}
                  </div>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: member.status === 'leave' ? tokens.textMuted : tokens.textSecondary }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals - Mobile Only */}
          {isMobile && (
            <div
              className="p-5"
              style={{
                backgroundColor: tokens.bgCard,
                borderRadius: tokens.cardRadius,
                border: `1px solid ${tokens.border}`,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] uppercase tracking-wider" style={{ color: tokens.textSecondary }}>
                  Pending
                </h3>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 text-white"
                  style={{
                    backgroundColor: tokens.accent,
                    borderRadius: tokens.buttonRadius,
                  }}
                >
                  2
                </span>
              </div>

              <div className="space-y-3">
                {pendingRequests.map((req, i) => (
                  <div
                    key={i}
                    className="p-3"
                    style={{
                      backgroundColor: tokens.bgPrimary,
                      borderRadius: '16px',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-7 h-7 flex items-center justify-center text-[10px] font-semibold"
                        style={{
                          backgroundColor: '#E5E5EA',
                          borderRadius: tokens.buttonRadius,
                          color: tokens.textSecondary,
                        }}
                      >
                        {req.initials}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">{req.name}</p>
                        <p className="text-[10px]" style={{ color: tokens.textSecondary }}>
                          {req.dates} • {req.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 py-1.5 text-[10px] font-medium text-white lowercase"
                        style={{
                          backgroundColor: tokens.accent,
                          borderRadius: '10px',
                        }}
                      >
                        approve
                      </button>
                      <button
                        className="flex-1 py-1.5 text-[10px] font-medium lowercase"
                        style={{
                          backgroundColor: tokens.bgCard,
                          border: `1px solid ${tokens.border}`,
                          borderRadius: '10px',
                        }}
                      >
                        decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        </main>

        {/* Right Panel - Hidden on mobile, shown on tablet+ */}
        {!isMobile && (
          <aside
            className="overflow-y-auto p-4 md:p-6 md:pl-0"
            style={{
              width: isTablet ? 280 : RIGHT_PANEL_WIDTH,
              flexShrink: 0,
            }}
          >
        <div className="space-y-5">
          {/* Balance - Highlights Style */}
          <div
            className="p-5"
            style={{
              backgroundColor: tokens.bgCard,
              borderRadius: tokens.cardRadius,
              border: `1px solid ${tokens.border}`,
            }}
          >
            <h3
              className="text-[10px] uppercase tracking-wider mb-4"
              style={{ color: tokens.textSecondary }}
            >
              Your Balance
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Sick Leave', used: 4, total: 14 },
                { label: 'Casual', used: 3, total: 10 },
                { label: 'Paternity', used: 0, total: 14 },
                { label: 'Marriage', used: 0, total: 5 },
              ].map((item, i) => {
                const remaining = item.total - item.used;
                const percentage = (remaining / item.total) * 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-xs"
                        style={{ color: tokens.textPrimary }}
                      >
                        {item.label}
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: tokens.valueText }}
                      >
                        {remaining}
                      </span>
                    </div>
                    {/* Progress Bar - Thin & Delicate */}
                    <div
                      className="w-full rounded-full overflow-hidden"
                      style={{
                        height: '1px',
                        backgroundColor: '#E5E5EA',
                      }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: '#B8B8BC',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending */}
          <div
            className="p-5"
            style={{
              backgroundColor: tokens.bgCard,
              borderRadius: tokens.cardRadius,
              border: `1px solid ${tokens.border}`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] uppercase tracking-wider" style={{ color: tokens.textSecondary }}>
                Pending
              </h3>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 text-white"
                style={{
                  backgroundColor: tokens.accent,
                  borderRadius: tokens.buttonRadius,
                }}
              >
                2
              </span>
            </div>

            <div className="space-y-3">
              {pendingRequests.map((req, i) => (
                <div
                  key={i}
                  className="p-3"
                  style={{
                    backgroundColor: tokens.bgPrimary,
                    borderRadius: '16px',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-7 h-7 flex items-center justify-center text-[10px] font-semibold"
                      style={{
                        backgroundColor: '#E5E5EA',
                        borderRadius: tokens.buttonRadius,
                        color: tokens.textSecondary,
                      }}
                    >
                      {req.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{req.name}</p>
                      <p className="text-[10px]" style={{ color: tokens.textSecondary }}>
                        {req.dates} • {req.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-1.5 text-[10px] font-medium text-white lowercase"
                      style={{
                        backgroundColor: tokens.accent,
                        borderRadius: '10px',
                      }}
                    >
                      approve
                    </button>
                    <button
                      className="flex-1 py-1.5 text-[10px] font-medium lowercase"
                      style={{
                        backgroundColor: tokens.bgCard,
                        border: `1px solid ${tokens.border}`,
                        borderRadius: '10px',
                      }}
                    >
                      decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div
            className="p-5 text-white"
            style={{
              backgroundColor: tokens.accent,
              borderRadius: tokens.cardRadius,
            }}
          >
            <p className="text-xs font-medium leading-relaxed mb-3">
              "When it comes to luck, you make your own."
            </p>
            <p className="text-[10px] opacity-60">Bruce Springsteen</p>

            <div className="flex gap-2 mt-4">
              {[Star, Share2].map((Icon, i) => (
                <button
                  key={i}
                  className="w-7 h-7 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>
        </div>
        </aside>
        )}
      </div>

      {/* Request Time Off Modal */}
      <RequestTimeOffModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
}
