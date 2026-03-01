import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function CustomDatePicker({ value, onChange, placeholder = "Select a date" }: CustomDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const numDays = daysInMonth(month, year);
        const startingDay = firstDayOfMonth(month, year);
        const days = [];

        // Previous month empty days
        for (let i = 0; i < startingDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10" />);
        }

        // Current month days
        for (let i = 1; i <= numDays; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isSelected = value === dateStr;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            days.push(
                <button
                    key={i}
                    type="button"
                    onClick={() => {
                        onChange(dateStr);
                        setIsOpen(false);
                    }}
                    className={`h-10 w-full flex items-center justify-center rounded-full text-sm transition-all
                        ${isSelected ? 'bg-gold text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.4)]' :
                            isToday ? 'border border-gold text-gold hover:bg-gold/10' :
                                'text-white/70 hover:bg-white/10 hover:text-white'}`}
                >
                    {i}
                </button>
            );
        }

        return days;
    };

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

    // Handle initial timezone issues (adding fake T00:00:00 wrapper)
    const getDisplayDate = () => {
        if (!value) return placeholder;
        const splitStr = value.split('-');
        const d = new Date(Number(splitStr[0]), Number(splitStr[1]) - 1, Number(splitStr[2]));
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    const displaySelectedDate = getDisplayDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-left focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-gold/50" />
                    <span className={value ? "text-white" : "text-white/40"}>
                        {displaySelectedDate}
                    </span>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-2 left-0 bg-emerald-deep/80 backdrop-blur-xl border border-gold/30 rounded-2xl shadow-2xl overflow-hidden p-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <button type="button" onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <ChevronLeft className="w-5 h-5 text-white/70" />
                            </button>
                            <div className="font-serif text-white/90 font-medium tracking-wide">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </div>
                            <button type="button" onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <ChevronRight className="w-5 h-5 text-white/70" />
                            </button>
                        </div>

                        {/* Days of week */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-white/40">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {renderCalendar()}
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={() => { onChange(''); setIsOpen(false); }}
                                className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider"
                            >
                                Clear Date
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
