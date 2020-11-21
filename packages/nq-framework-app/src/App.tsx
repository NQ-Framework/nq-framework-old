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
import { AuthProvider } from "./firebase/firebase-context";
import { SignInPage } from "./pages/SignInPage";
import { WorkflowsPage } from "./pages/WorkflowsPage";

export const App = () => (
  <AuthProvider>
    <ChakraProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/">
            <WorkflowsPage />
          </Route>
          <Route path="/workflows/:workflowId">
            <EditorPage />
          </Route>
          <Route paht="/signin">
            <SignInPage />
          </Route>
        </Switch>
      </Router>
    </ChakraProvider>
  </AuthProvider>
)
