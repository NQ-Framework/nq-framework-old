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
import { NewWorkflowPage } from "./pages/NewWorkflowPage";
import { OrganizationProvider } from "./core/organization-context";
import { HomePage } from "./pages/HomePage";
import { DataCredentialsTypes } from "./pages/DataCredentialsTypes";
import { NewDataCredentialsType } from "./pages/NewDataCredentialsType";

export const App = () => (
  <OrganizationProvider>
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route path="/data-credentials/types/new">
              <NewDataCredentialsType />
            </Route>
            <Route path="/data-credentials/types">
              <DataCredentialsTypes />
            </Route>
            <Route path="/workflows/new">
              <NewWorkflowPage />
            </Route>
            <Route path="/workflows/:workflowId">
              <EditorPage />
            </Route>
            <Route path="/workflows">
              <WorkflowsPage />
            </Route>
            <Route paht="/signin">
              <SignInPage />
            </Route>
          </Switch>
        </Router>
      </ChakraProvider>
    </AuthProvider>
  </OrganizationProvider>
)
