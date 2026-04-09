import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface PreorderItem {
  id: string;
  title: string;
  price: string;
  image_url: string;
  status: 'pending' | 'secured' | 'shipped';
}

interface PreorderContextType {
  preorders: PreorderItem[];
  addPreorder: (item: Omit<PreorderItem, 'status'>) => void;
  removePreorder: (id: string) => void;
  getPreorderCount: () => number;
}

const PreorderContext = createContext<PreorderContextType | undefined>(undefined);

export const PreorderProvider = ({ children }: { children: ReactNode }) => {
  const [preorders, setPreorders] = useState<PreorderItem[]>([]);

  const addPreorder = (item: Omit<PreorderItem, 'status'>) => {
    setPreorders((prev) => {
      // Проверяем, нет ли уже этого дропа в предзаказах (обычно дроп можно забронировать только 1 раз)
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev;
      
      return [...prev, { ...item, status: 'secured' }];
    });
  };

  const removePreorder = (id: string) => {
    setPreorders((prev) => prev.filter((item) => item.id !== id));
  };

  const getPreorderCount = () => {
    return preorders.length;
  };

  return (
    <PreorderContext.Provider value={{ preorders, addPreorder, removePreorder, getPreorderCount }}>
      {children}
    </PreorderContext.Provider>
  );
};

export const usePreorders = () => {
  const context = useContext(PreorderContext);
  if (!context) throw new Error('usePreorders must be used within a PreorderProvider');
  return context;
};