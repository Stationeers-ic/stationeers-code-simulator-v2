import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { ic10 } from "codemirror-lang-ic10";
import { yaml } from "@codemirror/lang-yaml";
import { Box, Button, Grid, GridItem } from "@chakra-ui/react"
import useIc10 from "./hooks/Builder";

function App() {
  const height = "620px"

  const { ic10Code, setIc10, setYaml, step, yamlCode, run } = useIc10()


  return <Grid templateColumns="repeat(3, 1fr)" gap="6" >
    <GridItem colSpan={2} >
      <Box>Ic10

        <Button onClick={step}>step</Button>
        <Button onClick={run}>run</Button>
      </Box>
      <Box flex="1" >
        <CodeMirror value={ic10Code} onChange={(v) => setIc10(v)} height={height} theme={vscodeDark} extensions={[ic10()]} />
      </Box>
    </GridItem>
    <GridItem >
      <Box>Env</Box>
      <Box flex="1">
        <CodeMirror value={yamlCode} onChange={(v) => setYaml(v)} height={height} theme={vscodeDark} extensions={[yaml()]} />
      </Box>
    </GridItem>
  </Grid>
    ;
}
export default App;
