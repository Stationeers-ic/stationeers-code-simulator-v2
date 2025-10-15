// biome-ignore assist/source/organizeImports: <1>
import * as ic10 from "ic10";
import { useEffect, useState, useCallback } from "react";

function useIc10() {
    const [builder, setBuilder] = useState<ic10.Builer | null>(null);
    const [ic10Code, setIc10] = useState("");
    const [yamlCode, setYaml] = useState("");

    // Инициализация из YAML
    const initializeFromYaml = useCallback((yaml: string) => {
        try {
            const b = ic10.Builer.from(yaml);
            setBuilder(b);
            const chip = Array.from(b.Chips)[0][1];
            setIc10(chip.getIc10Code());
            b.init();
            setYaml(yaml);
        } catch (e) {
            console.warn(e);
        }
    }, []);

    // Обновление из IC10 кода
    const updateFromIc10 = useCallback(
        (code: string) => {
            if (!builder) return;

            const chip = Array.from(builder.Chips)[0][1];
            chip.setIc10Code(code);
            setYaml(builder.toYaml());
            setIc10(code);
        },
        [builder],
    );

    const step = useCallback(async () => {
        if (!builder) return;
        const runner = Array.from(builder.Runners)[0][1]
        runner.switchContext('real')
        console.log(runner)
        await runner.step()
        const y = builder.toYaml()
        setYaml(y);
    }, [builder]);

    const run = useCallback(async () => {
        if (!builder) return;

        builder.init();
        while ((await builder.step()) === true) {
            console.log("step");
        }
        const y = builder.toYaml()
        setYaml(y);
        console.log("run end", y)
    }, [builder]);

    // Инициализация при первом рендере
    useEffect(() => {
        console.log("init")
        // Можно установить начальное значение по умолчанию
        initializeFromYaml(`
version: 1
chips:
  - id: 1
    register_length: 18
    stack_length: 512
    SP: 16
    RA: 17
    registers:
      - name: r1
        value: 10
    stack: []
    code: |
        move r0 1
        move r2 2
        move r3 3
        move r4 4

devices:
  - id: 1
    PrefabName: StructureCircuitHousingCompact
    name: MyDevice
    chip: 1
    ports:
      - port: default
        network: base
    props:
      - name: Setting
        value: 10
      - name: Mode
        value: 12

  - id: 2
    PrefabName: StructureAutolathe
    ports:
      - port: default
        network: base
    slots:
      - index: 1
        item: ItemIronOre
        amount: 25
    reagents:
      - name: Iron
        amount: 100
networks:
  - id: base
    type: data
    props:
      - name: Channel0
        value: 10
      - name: Channel1
        value: 1
  - id: power
    type: power

            `);
    }, [initializeFromYaml]);

    return {
        ic10Code,
        setIc10: updateFromIc10,
        yamlCode,
        setYaml: initializeFromYaml,
        step,
        run
    };
}

export default useIc10;
