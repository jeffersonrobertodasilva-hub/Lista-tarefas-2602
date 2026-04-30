'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { Task } from '@/types/todo';
import { BarChart3, PieChart, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Analises() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from('tasks').select('*');
      if (!error && data) {
        setTasks(data.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          completed: t.completed,
          category: t.category,
          priority: t.priority,
          dueDate: t.due_date,
          createdAt: t.created_at,
        })));
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const byCategory = {
    Trabalho: tasks.filter(t => t.category === 'Trabalho').length,
    Pessoal: tasks.filter(t => t.category === 'Pessoal').length,
    Estudos: tasks.filter(t => t.category === 'Estudos').length,
  };

  const byPriority = {
    Alta: tasks.filter(t => t.priority === 'Alta').length,
    Média: tasks.filter(t => t.priority === 'Média').length,
    Baixa: tasks.filter(t => t.priority === 'Baixa').length,
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            Análises de Produtividade
          </h1>
          <p className="text-slate-500 text-lg">
            Acompanhe seu desempenho e estatísticas em tempo real.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6"
        >
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 task-item-shadow">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Concluídas</p>
                <p className="text-2xl font-display font-bold text-slate-900">{completed}</p>
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 task-item-shadow">
              <div className="bg-amber-50 p-3 rounded-2xl">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pendentes</p>
                <p className="text-2xl font-display font-bold text-slate-900">{pending}</p>
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 task-item-shadow">
              <div className="bg-emerald-50 p-3 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Taxa de Sucesso</p>
                <p className="text-2xl font-display font-bold text-slate-900">{rate}%</p>
              </div>
            </motion.div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={item} className="bg-white p-8 rounded-[2rem] border border-slate-200 task-item-shadow">
              <h3 className="text-lg font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-slate-400" />
                Por Categoria
              </h3>
              <div className="space-y-4">
                {Object.entries(byCategory).map(([cat, count]) => (
                  <div key={cat} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{cat}</span>
                      <span className="text-slate-400">{count} tarefas</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                        className={`h-full rounded-full ${
                          cat === 'Trabalho' ? 'bg-amber-400' : cat === 'Pessoal' ? 'bg-blue-400' : 'bg-emerald-400'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-white p-8 rounded-[2rem] border border-slate-200 task-item-shadow">
              <h3 className="text-lg font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-slate-400" />
                Por Prioridade
              </h3>
              <div className="flex items-end justify-between h-32 gap-4">
                {Object.entries(byPriority).map(([pri, count]) => (
                  <div key={pri} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-50 rounded-t-xl relative flex flex-col justify-end overflow-hidden" style={{ height: '100%' }}>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${total > 0 ? (count / total) * 100 : 0}%` }}
                        className={`w-full rounded-t-xl ${
                          pri === 'Alta' ? 'bg-rose-400' : pri === 'Média' ? 'bg-yellow-400' : 'bg-slate-400'
                        }`}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{pri}</span>
                    <span className="text-sm font-bold text-slate-900">{count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div variants={item} className="bg-indigo-600 p-8 rounded-[2rem] text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-2xl font-display font-bold mb-2">Continue assim!</h3>
              <p className="text-indigo-100 max-w-md">
                Você já concluiu {completed} tarefas no total. Manter uma rotina organizada é a chave para o sucesso a longo prazo.
              </p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <TrendingUp className="w-32 h-32" />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
