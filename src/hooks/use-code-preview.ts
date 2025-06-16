
import { useState } from 'react';

export function useCodePreview() {
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const handleComponentPreview = (component: any) => {
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
