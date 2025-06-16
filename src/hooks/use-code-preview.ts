
import { useState } from 'react';
import type { Component } from '@/types/api';

export function useCodePreview() {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const handleComponentPreview = (component: Component) => {
    setSelectedComponent(component);
    setIsCodeModalOpen(true);
  };

  const closeCodeModal = () => {
    setIsCodeModalOpen(false);
  };

  return {
    selectedComponent,
    isCodeModalOpen,
    handleComponentPreview,
    closeCodeModal,
  };
}
