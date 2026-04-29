'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { Task } from '@/types/todo';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Calendario() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from('tasks').select('*');
      if (!error && data) {
        setTasks(data.map((t: any) => ({
          id: t.id,
          title: t.title,
          completed: t.completed,
          category: t.category,
          dueDate: t.due_date,
        })));
      }
      setLoading(false);
    };
    fetchTasks();
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Trabalho': return 'bg-amber-400';
      case 'Pessoal': return 'bg-blue-400';
      case 'Estudos': return 'bg-emerald-400';
      default: return 'bg-slate-400';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">
              Calendário
            </h1>
            <p className="text-slate-500 text-lg">
              Visualize sua agenda e prazos mensais.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h2 className="text-lg font-display font-bold text-slate-900 min-w-[150px] text-center capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dayTasks = tasks.filter(task => task.dueDate && isSameDay(new Date(task.dueDate), day));
              const isSelectedMonth = isSameMonth(day, monthStart);

              return (
                <div 
                  key={idx} 
                  className={`min-h-[120px] p-2 border-r border-b border-slate-50 last:border-r-0 relative transition-colors ${
                    !isSelectedMonth ? 'bg-slate-50/30' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <span className={`text-sm font-bold ${
                    isSelectedMonth ? 'text-slate-700' : 'text-slate-300'
                  } ${isSameDay(day, new Date()) ? 'bg-primary text-white w-7 h-7 flex items-center justify-center rounded-full ml-auto' : 'block text-right'}`}>
                    {format(day, 'd')}
                  </span>
                  
                  <div className="mt-2 space-y-1">
                    {dayTasks.map(task => (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={task.id}
                        className={`text-[10px] px-1.5 py-0.5 rounded-md text-white truncate font-medium cursor-default flex items-center gap-1 ${
                          getCategoryColor(task.category)
                        } ${task.completed ? 'opacity-40 grayscale' : ''}`}
                        title={task.title}
                      >
                        <div className="w-1 h-1 bg-white rounded-full flex-shrink-0" />
                        {task.title}
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-6 justify-center text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span>Trabalho</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span>Pessoal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span>Estudos</span>
          </div>
        </div>
      </main>
    </>
  );
}
