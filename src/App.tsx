import { useCallback, useState } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { ic10 } from "codemirror-lang-ic10";
import { yaml } from "@codemirror/lang-yaml";
import { Box, Grid, GridItem } from "@chakra-ui/react"

function App() {
  const [value, setValue] = useState("");
  const onChange = useCallback((val: string) => {
    setValue(val);
  }, []);
  return <>
    <Grid templateColumns="repeat(3, 1fr)" gap="6" height={"100vh"}>
      <GridItem  >
        <Box>Ic10</Box>
        <Box flex="1" >
          <CodeMirror height="200px" value={value} theme={vscodeDark} extensions={[ic10()]} onChange={onChange} />
        </Box>
      </GridItem>
      <GridItem >
        output
      </GridItem>

      <GridItem >
        <Box>Ic10</Box>
        <Box flex="1">
          <CodeMirror value={value} theme={vscodeDark} extensions={[yaml()]} onChange={onChange} />
        </Box>
      </GridItem>
    </Grid>
  </>
    ;
}
export default App;
