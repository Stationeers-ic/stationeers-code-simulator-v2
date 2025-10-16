// biome-ignore assist/source/organizeImports: <1>
import * as ic10 from "ic10";
import { useState, useCallback } from "react";


function useIc10() {
  const [builder, setBuilder] = useState<ic10.Builer | null>(null);
  const [currentEnv, setCurrentEnv] = useState("");
  const [line, setLine] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Инициализация из YAML
  const initializeFromYaml = useCallback(async (yaml: string) => {
    try {
      setLoading(true);
      setLine(0)
      const b = ic10.Builer.from(yaml);
      await b.init();
      setCurrentEnv(b.toYaml());
      setBuilder(b);
      setLoading(false);
      setInitialized(true);
    } catch (e) {
      console.warn(e);
      setLoading(false);
      setInitialized(false);
    }
  }, []);

  const step = useCallback(async () => {
    if (!builder) {
      setInitialized(false);
      return
    }
    try {
      const end = await builder.step()
      if (end === false) {
        setInitialized(false);
      }
      setCurrentEnv(builder.toYaml());
      setLine(line + 1)
    } catch (e) {
      console.warn(e)
      setInitialized(false);
    }
  }, [builder, line]);

  return {
    currentEnv,
    init: initializeFromYaml,
    step,
    loading,
    initialized,
    line
  };
}

export default useIc10;
