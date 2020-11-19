import * as React from "react"
import { GridItem, Text } from "@chakra-ui/react"
import { Diagram } from "../components/diagram"
import { Layout } from "../components/layout";
import { useEffect, useState } from "react";
import { WorkflowService } from "../services/workflow.service";
import { Workflow } from "@nqframework/models";

export const EditorPage: React.FC = () => {
    const [workflow, setWorkflow] = useState<Workflow | null>(null);

    useEffect(() => {
        const service = new WorkflowService();
        service.getWorkflow().then(wf => {
            setWorkflow(wf);
        });
    }, [])
    return (
        <Layout>
            <GridItem>
                <Text>Ovo je editor page</Text>
            </GridItem>
            <GridItem>
                {workflow ? <Diagram workflow={workflow!} /> : <Text>No workflow :(</Text>}
            </GridItem>
        </Layout>
    );
}