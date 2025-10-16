// biome-ignore assist/source/organizeImports: <1>
import * as ic10 from "ic10";
import { useState, useCallback } from "react";

type useIc10Params = {
  printMessage?: (msg: string) => void,
  getRunners?: (runners: Map<number, ic10.Ic10Runner>) => void,
}

function useIc10({ printMessage, getRunners }: useIc10Params) {
  const [builder, setBuilder] = useState<ic10.Builer | null>(null);
  const [currentEnv, setCurrentEnv] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Инициализация из YAML
  const initializeFromYaml = useCallback(async (yaml: string) => {
    try {
      setLoading(true);
      const b = ic10.Builer.from(yaml);
      if (await b.init()) {
        setCurrentEnv(b.toYaml());
        setBuilder(b);
        setLoading(false);
        setInitialized(true);
        if (getRunners) {
          getRunners(b.Runners)
        }
      }
      if (printMessage) {
        b.Runners.forEach((runner) => {
          runner.sanboxContext.$errors.forEach((error) => {
            if (error) {
              printMessage(error.formated_message)
            }
          })
        })
      }
    } catch (e) {
      if (e instanceof ic10.Ic10Error && printMessage) {
        printMessage(e.formated_message)
      }
      console.warn(e);
      setLoading(false);
      setInitialized(false);
    }
  }, [getRunners, printMessage]);

  const step = useCallback(async () => {

    if (!builder) {
      setInitialized(false);
      if (printMessage) printMessage("Не инициализирован")
      return
    }
    if (!initialized) {
      if (printMessage) printMessage("Не инициализирован")
      return
    }
    try {
      const end = await builder.step()
      if (end === false) {
        setInitialized(false);
      }
      setCurrentEnv(builder.toYaml());
      if (printMessage) {
        builder.Runners.forEach((runner) => {
          runner.realContext.$errors.forEach((error) => {
            if (error) {
              printMessage(error.formated_message)
            }
          })
        })
      }
    } catch (e) {
      if (e instanceof ic10.Ic10Error && printMessage) {
        printMessage(e.formated_message)
      }
      console.warn(e)
      setInitialized(false);
    }
  }, [builder, initialized, printMessage]);

  return {
    currentEnv,
    init: initializeFromYaml,
    step,
    loading,
    initialized,
  };
}

export default useIc10;
