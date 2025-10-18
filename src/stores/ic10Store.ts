// stores/ic10Store.ts
import { create } from 'zustand';
import * as ic10 from 'ic10';

interface Ic10State {
  // Состояние
  initialEnv: string;
  currentEnv: string;
  terminalOutput: string[];
  runners: Map<number, ic10.Ic10Runner> | null;
  loading: boolean;
  initialized: boolean;
  builder: ic10.Builer | null;
  
  // Действия
  setInitialEnv: (env: string) => void;
  setCurrentEnv: (env: string) => void;
  setRunners: (runners: Map<number, ic10.Ic10Runner>) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setBuilder: (builder: ic10.Builer | null) => void;
  
  // Действия терминала
  addToTerminal: (message: string) => void;
  clearTerminal: () => void;
  
  // IC10 операции
  initializeFromYaml: (yaml: string) => Promise<void>;
  step: () => Promise<void>;
  getCurrentEnv: () => string | undefined;
}

export const useIc10Store = create<Ic10State>((set, get) => ({
  // Начальное состояние
  initialEnv: `
version: 1
chips:
  - id: 1
    code: |
      s db:0 Channel4 15
  - id: 2
    code: |
      yield
      l r1 db:0 Channel4

devices:
  - id: 1
    PrefabName: StructureCircuitHousingCompact
    chip: 1
    ports:
      - port: default
        network: base
  - id: 2
    PrefabName: StructureCircuitHousingCompact
    chip: 2
    ports:
      - port: default
        network: base
networks:
  - id: base
    type: data
  `,
  currentEnv: '',
  terminalOutput: [],
  runners: null,
  loading: false,
  initialized: false,
  builder: null,

  // Сеттеры
  setInitialEnv: (initialEnv) => set({ initialEnv }),
  setCurrentEnv: (currentEnv) => set({ currentEnv }),
  setRunners: (runners) => set({ runners }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  setBuilder: (builder) => set({ builder }),

  // Действия терминала
  addToTerminal: (message:string) => 
    set((state) => ({ 
      terminalOutput: [...state.terminalOutput, `> ${message}`] 
    })),
  
  clearTerminal: () => set({ terminalOutput: [] }),

  // IC10 операции
  initializeFromYaml: async (yaml: string) => {
    try {
      const { addToTerminal, setRunners } = get();
      
      set({ initialized: false, loading: true });
      const builder = ic10.Builer.from(yaml);
      
      if (await builder.init()) {
        set({
          currentEnv: builder.toYaml(),
          builder,
          initialized: true,
          runners: builder.Runners
        });
        
        setRunners(builder.Runners);
        
        // Обработка ошибок
        builder.Runners.forEach((runner) => {
          runner.sanboxContext.$errors.forEach((error) => {
            if (error) {
              addToTerminal(`[chip: ${runner.realContext.housing.id}] ${error.formated_message}`);
            }
          });
        });
      }
      set({ loading: false });
    } catch (e) {
      const { addToTerminal } = get();
      
      if (e instanceof ic10.Ic10Error) {
        addToTerminal(e.formated_message);
      }
      console.warn(e);
      set({ loading: false, initialized: false });
    }
  },

  step: async () => {
    const { builder, initialized, addToTerminal, setCurrentEnv, setInitialized } = get();
    
    if (!builder || !initialized) {
      addToTerminal("Не инициализирован");
      return;
    }

    try {
      const end = await builder.step();
      if (end === false) {
        setInitialized(false);
      }
      
      setCurrentEnv(builder.toYaml());
      
      // Обработка ошибок
      builder.Runners.forEach((runner) => {
        runner.realContext.$errors.forEach((error) => {
          if (error) {
            addToTerminal(`[chip: ${runner.realContext.housing.id}] ${error.formated_message}`);
          }
        });
      });
    } catch (e) {
      if (e instanceof ic10.Ic10Error) {
        addToTerminal(e.formated_message);
      }
      console.warn(e);
      setInitialized(false);
    }
  },

  getCurrentEnv: () => {
    const { builder } = get();
    return builder?.toYaml();
  }
}));