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
import { DataCredentialsTypesPage } from "./pages/DataCredentialsTypesPage";
import { DataCredentialsPage } from "./pages/DataCredentialsPage";
import { NewDataCredentialsTypePage } from "./pages/NewDataCredentialsTypePage";
import { NewDataCredentialsPage } from "./pages/NewDataCredentialsPage";

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
              <NewDataCredentialsTypePage />
            </Route>
            <Route path="/data-credentials/types">
              <DataCredentialsTypesPage />
            </Route>
            <Route path="/data-credentials/new">
              <NewDataCredentialsPage />
            </Route>
            <Route path="/data-credentials/">
              <DataCredentialsPage />
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
