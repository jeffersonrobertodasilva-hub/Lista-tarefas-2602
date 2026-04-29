'use client';

import React from 'react';
import { Trash2, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { Task } from '@/types/todo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCard = ({ task, onToggle, onDelete }: TaskCardProps) => {
  const categoryColors = {
    Trabalho: 'bg-amber-100 text-amber-700 border-amber-200',
    Pessoal: 'bg-blue-100 text-blue-700 border-blue-200',
    Estudos: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  const priorityColors = {
    Alta: 'bg-rose-100 text-rose-700 border-rose-200',
    Média: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Baixa: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div
      className={`group flex items-center gap-4 p-4 bg-white border rounded-2xl task-item-shadow ${
        task.completed ? 'opacity-60 grayscale-[0.3]' : ''
      }`}
    >
      {/* Custom Checkbox */}
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-full cursor-pointer checked:bg-primary checked:border-primary transition-all"
        />
        <svg
          className="absolute w-3.5 h-3.5 text-white pointer-events-none hidden peer-checked:block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryColors[task.category]}`}>
            {task.category}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <h3 className={`font-medium text-slate-900 truncate transition-all ${task.completed ? 'line-through decoration-slate-400' : ''}`}>
          {task.title}
        </h3>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{format(new Date(task.dueDate), "d 'de' MMMM", { locale: ptBR })}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={() => onDelete(task.id)}
        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
        title="Excluir tarefa"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TaskCard;
