import * as React from "react"
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { EditorPage } from "./pages/EditorPage";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
      <Switch>
        <Route exact path="/">
          <EditorPage />
        </Route>
      </Switch>
    </Router>
  </ChakraProvider>
)
