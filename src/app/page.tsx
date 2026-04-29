'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import Filters from '@/components/Filters';
import { Task, FilterType, Category, Priority } from '@/types/todo';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('Todas');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch from Supabase
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar tarefas:', error);
    } else if (data) {
      const mappedTasks: Task[] = data.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        completed: t.completed,
        category: t.category,
        priority: t.priority,
        dueDate: t.due_date,
        createdAt: t.created_at,
      }));
      setTasks(mappedTasks);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async ({ title, category, priority, dueDate }: { title: string; category: Category; priority: Priority; dueDate: string }) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        { 
          title, 
          category, 
          priority, 
          due_date: dueDate,
          completed: false 
        }
      ])
      .select();

    if (error) {
      console.error('Erro ao adicionar tarefa:', error);
    } else if (data) {
      const t = data[0];
      const newTask: Task = {
        id: t.id,
        title: t.title,
        completed: t.completed,
        category: t.category,
        priority: t.priority,
        dueDate: t.due_date,
        createdAt: t.created_at,
      };
      setTasks([newTask, ...tasks]);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar tarefa:', error);
    } else {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir tarefa:', error);
    } else {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Pendentes') return !t.completed;
    if (filter === 'Concluídas') return t.completed;
    return true;
  });

  const counts = {
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">
              Minhas Tarefas
            </h1>
            <p className="text-slate-500 text-lg">
              Gerencie suas atividades com sincronização em nuvem.
            </p>
          </div>
          {isLoading && (
             <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        <section className="mb-10">
          <TaskForm onAdd={addTask} />
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <Filters 
              currentFilter={filter} 
              onFilterChange={setFilter} 
              count={counts} 
            />
          </div>

          <div className="grid gap-3">
            {!isLoading && filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggle={toggleTask} 
                  onDelete={deleteTask} 
                />
              ))
            ) : !isLoading ? (
              <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-200">
                <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-slate-900 font-display font-semibold text-lg">Tudo limpo por aqui!</h3>
                <p className="text-slate-400 max-w-xs mx-auto mt-1">
                  Você não tem tarefas {filter === 'Todas' ? 'cadastradas' : filter.toLowerCase()}.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          <span className="text-slate-500 font-medium tracking-wide uppercase text-[10px]">Sincronizado com Supabase Cloud</span>
        </div>
        <p>© 2026 TaskFlow - Integrado via Supabase MCP</p>
      </footer>
    </>
  );
}
