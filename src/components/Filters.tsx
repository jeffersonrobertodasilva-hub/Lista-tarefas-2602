'use client';

import React from 'react';
import { FilterType } from '@/types/todo';

interface FiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  count: {
    total: number;
    pending: number;
    completed: number;
  };
}

const Filters = ({ currentFilter, onFilterChange, count }: FiltersProps) => {
  const filters: { label: FilterType; count: number }[] = [
    { label: 'Todas', count: count.total },
    { label: 'Pendentes', count: count.pending },
    { label: 'Concluídas', count: count.completed },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.label}
          onClick={() => onFilterChange(filter.label)}
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            currentFilter === filter.label
              ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          {filter.label}
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
            currentFilter === filter.label ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-600'
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Filters;
