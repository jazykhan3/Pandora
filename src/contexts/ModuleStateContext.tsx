import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModuleState {
  [key: string]: any;
}

interface ModuleStateContextType {
  getModuleState: (moduleName: string) => any;
  setModuleState: (moduleName: string, state: any) => void;
  clearModuleState: (moduleName: string) => void;
  saveModuleState: (moduleName: string, state: any) => void;
}

const ModuleStateContext = createContext<ModuleStateContextType | undefined>(undefined);

export const useModuleState = () => {
  const context = useContext(ModuleStateContext);
  if (!context) {
    throw new Error('useModuleState must be used within a ModuleStateProvider');
  }
  return context;
};

interface ModuleStateProviderProps {
  children: ReactNode;
}

export const ModuleStateProvider: React.FC<ModuleStateProviderProps> = ({ children }) => {
  const [moduleStates, setModuleStates] = useState<Record<string, ModuleState>>({});

  const getModuleState = (moduleName: string) => {
    return moduleStates[moduleName] || {};
  };

  const setModuleState = (moduleName: string, state: any) => {
    setModuleStates(prev => ({
      ...prev,
      [moduleName]: { ...prev[moduleName], ...state }
    }));
  };

  const clearModuleState = (moduleName: string) => {
    setModuleStates(prev => {
      const newStates = { ...prev };
      delete newStates[moduleName];
      return newStates;
    });
  };

  const saveModuleState = (moduleName: string, state: any) => {
    // Auto-save to localStorage for persistence across sessions
    try {
      const savedStates = JSON.parse(localStorage.getItem('pandaura_module_states') || '{}');
      savedStates[moduleName] = state;
      localStorage.setItem('pandaura_module_states', JSON.stringify(savedStates));
    } catch (error) {
      console.warn('Failed to save module state to localStorage:', error);
    }
    
    setModuleState(moduleName, state);
  };

  // Load states from localStorage on initialization
  React.useEffect(() => {
    try {
      const savedStates = JSON.parse(localStorage.getItem('pandaura_module_states') || '{}');
      setModuleStates(savedStates);
    } catch (error) {
      console.warn('Failed to load module states from localStorage:', error);
    }
  }, []);

  return (
    <ModuleStateContext.Provider value={{
      getModuleState,
      setModuleState,
      clearModuleState,
      saveModuleState
    }}>
      {children}
    </ModuleStateContext.Provider>
  );
};