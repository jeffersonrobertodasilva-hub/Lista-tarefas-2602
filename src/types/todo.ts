export type Category = 'Trabalho' | 'Pessoal' | 'Estudos';
export type Priority = 'Alta' | 'Média' | 'Baixa';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: Category;
  priority: Priority;
  dueDate: string;
  createdAt: string;
}

export type FilterType = 'Todas' | 'Pendentes' | 'Concluídas';
