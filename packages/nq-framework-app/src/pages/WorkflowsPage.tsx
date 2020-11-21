import { Box, Button, GridItem, Heading, Link, Text } from "@chakra-ui/react";
import * as React from "react";
import { Layout } from "../components/layout";
import 'firebase/auth';
import { AuthContext, initPromise } from "../firebase/firebase-context";
import { Redirect } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { WorkflowService } from "../services/workflow.service";
import { Workflow } from "@nqframework/models";

export const WorkflowsPage: React.FC = () => {
    const workflowService = useMemo(() => new WorkflowService(), []);
    const user = useContext(AuthContext);
    const [fbInit, setFbInit] = useState(false);
    const [workflows, setWorkflows] = useState<Workflow[]>([]);

    useEffect(() => {
        initPromise.then(() => {
            setFbInit(true);
            if (!user) {
                return;
            }
            workflowService.getWorkflows().then((wfs) => {
                setWorkflows(wfs);
            });
        });
    }, [user, workflowService]);
    if (!fbInit) {
        return <Heading>Loading...</Heading>
    }
    return (
        <>
            {!user ? (
                <Redirect to={{ pathname: "/signin" }} />
            ) : (
                    <Layout>
                        <GridItem padding={6}>
                            <Text width="100%" textAlign="center">Workflows</Text>
                        </GridItem>
                        <GridItem>
                            {workflows.map(w => (
                                <Link href={`/workflows/${w.id}`} ><Box><Heading>{w.name}</Heading></Box></Link>
                            ))}
                        </GridItem>
                    </Layout>
                )}
        </>
    );
};
