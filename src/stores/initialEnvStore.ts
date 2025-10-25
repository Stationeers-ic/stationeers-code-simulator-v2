// stores/initialEnvStore.ts

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const startEnv = `{
   "$schema": "https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Schemas/env.schema.json",
   "version": 1,
   "chips": [
      {
         "id": 1,
         "code": ""
      }
   ],
   "devices": [
      {
         "id": 1,
         "PrefabName": "StructureCircuitHousingCompact",
         "chip": 1,
         "ports": [
            {
               "port": "default",
               "network": "base"
            }
         ]
      }
   ],
   "networks": [
      {
         "id": "base",
         "type": "data"
      }
   ]
}`;

interface InitialEnvState {
	initialEnv: string;
	setInitialEnv: (env: string) => void;
	getInitialEnv: () => string;
	resetInitialEnv: () => void;
}

export const useInitialEnvStore = create<InitialEnvState>()(
	devtools(
		persist(
			(set, get) => ({
				initialEnv: startEnv,

				setInitialEnv: (initialEnv) => set({ initialEnv: initialEnv.trim() }),

				getInitialEnv: () => get().initialEnv,

				resetInitialEnv: () => set({ initialEnv: startEnv }),
			}),
			{
				name: "initial-env-storage",
				onRehydrateStorage: () => (state) => {
					// Проверяем после восстановления из localStorage
					if (state && (!state.initialEnv || !state.initialEnv.trim())) {
						state.initialEnv = startEnv;
					}
				},
				version: 1,
			},
		),
	),
);
