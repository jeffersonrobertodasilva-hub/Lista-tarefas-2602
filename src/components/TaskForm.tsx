'use client';

import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Tag, Flag } from 'lucide-react';
import { Category, Priority } from '@/types/todo';

interface TaskFormProps {
  onAdd: (task: { title: string; category: Category; priority: Priority; dueDate: string }) => void;
}

const TaskForm = ({ onAdd }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Pessoal');
  const [priority, setPriority] = useState<Priority>('Média');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({ title, category, priority, dueDate });
    setTitle('');
    setIsExpanded(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white border rounded-2xl p-4 transition-all duration-300 ${
        isExpanded ? 'ring-2 ring-primary/20 border-primary' : 'hover:border-slate-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="bg-slate-100 p-2 rounded-xl">
          <Plus className="w-5 h-5 text-slate-500" />
        </div>
        <input
          type="text"
          placeholder="Adicionar nova tarefa..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 font-medium"
        />
        {!isExpanded && title && (
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"
          >
            Adicionar
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Category Select */}
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="text-sm bg-slate-50 border-none rounded-lg focus:ring-1 focus:ring-primary py-1.5 pl-2 pr-8"
            >
              <option value="Pessoal">Pessoal</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Estudos">Estudos</option>
            </select>
          </div>

          {/* Priority Select */}
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-slate-400" />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="text-sm bg-slate-50 border-none rounded-lg focus:ring-1 focus:ring-primary py-1.5 pl-2 pr-8"
            >
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-sm bg-slate-50 border-none rounded-lg focus:ring-1 focus:ring-primary py-1.5 px-2"
            />
          </div>

          <div className="flex-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Salvar Tarefa
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default TaskForm;
